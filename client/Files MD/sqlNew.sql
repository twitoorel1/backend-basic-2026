-- MySQL 8.x - Full Project DDL (Spec + Appendices A–F + AUTH)
SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- ============================================================
-- AUTH
-- ============================================================
CREATE TABLE users (
  id            INT NOT NULL AUTO_INCREMENT,
  first_name    VARCHAR(100) NOT NULL,
  last_name     VARCHAR(100) NOT NULL,
  username      VARCHAR(100) NOT NULL,
  email         VARCHAR(200) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('VIEWER','EDITOR','ADMIN') NOT NULL DEFAULT 'VIEWER',
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at DATETIME NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uk_users_username (username),
  UNIQUE KEY uk_users_email (email),
  KEY idx_users_role (role),
  KEY idx_users_is_active (is_active),
  KEY idx_users_username_active (username, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE refresh_tokens (
  id          INT NOT NULL AUTO_INCREMENT,
  user_id     INT NOT NULL,
  token_hash  CHAR(64) NOT NULL,
  issued_at   DATETIME NOT NULL,
  expires_at  DATETIME NOT NULL,
  revoked_at  DATETIME NULL,
  user_agent  VARCHAR(255) NULL,
  ip          VARCHAR(45) NULL,

  PRIMARY KEY (id),
  UNIQUE KEY uk_refresh_tokens_token_hash (token_hash),
  KEY idx_refresh_tokens_user_expires (user_id, expires_at),

  CONSTRAINT fk_refresh_tokens_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- RULES / LOOKUPS
-- ============================================================
CREATE TABLE device_type (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  code         ENUM('RADIO','ZIAD','MOBILITY','OTHER') NOT NULL,
  display_name VARCHAR(120) NOT NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uk_device_type_code (code),
  UNIQUE KEY uk_device_type_display_name (display_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE device_type_mapping (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  match_kind     ENUM('MAKAT','NAME_CONTAINS') NOT NULL,
  match_value    VARCHAR(120) NOT NULL,
  device_type_id BIGINT UNSIGNED NOT NULL,
  priority       INT NOT NULL DEFAULT 100,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  KEY idx_device_type_mapping_lookup (match_kind, match_value, priority),
  KEY idx_device_type_mapping_device_type_id (device_type_id),

  CONSTRAINT fk_device_type_mapping_device_type
    FOREIGN KEY (device_type_id) REFERENCES device_type(id)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE encryption_profile (
  id                   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  profile_name         VARCHAR(80) NOT NULL,
  device_family        VARCHAR(40) NOT NULL,
  expected_car         INT NOT NULL,
  expected_simol       INT NULL,
  expected_period_code INT NULL,
  period_mode          ENUM('NONE','ZIAD','FIXED') NOT NULL DEFAULT 'NONE',
  created_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uk_encryption_profile_profile_name (profile_name),
  UNIQUE KEY uk_encryption_profile_device_family (device_family),
  KEY idx_encryption_profile_expected (expected_car, expected_simol, expected_period_code),

  CONSTRAINT chk_encryption_profile_period
    CHECK (
      (period_mode = 'NONE' AND expected_period_code IS NULL)
      OR (period_mode <> 'NONE' AND expected_period_code IS NOT NULL)
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE tag (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name       VARCHAR(40) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uk_tag_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE import_error_code (
  code        VARCHAR(60) NOT NULL,
  description VARCHAR(200) NOT NULL,

  PRIMARY KEY (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DEVICES (CORE)
-- ============================================================
CREATE TABLE core_device (
  id                   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  serial               VARCHAR(128) NOT NULL,
  makat                VARCHAR(64)  NOT NULL,
  device_name          VARCHAR(191) NOT NULL,
  current_unit_symbol  VARCHAR(64)  NOT NULL,
  device_type_id       BIGINT UNSIGNED NOT NULL,
  encryption_profile_id BIGINT UNSIGNED NULL,
  lifecycle_status     ENUM('NEW','PENDING_CARD','ACTIVE','NOT_ELIGIBLE','TRANSFERRED','REMOVED') NOT NULL DEFAULT 'NEW',
  created_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at           DATETIME NULL,

  PRIMARY KEY (id),
  UNIQUE KEY uk_core_device_serial (serial),

  KEY idx_core_device_makat (makat),
  KEY idx_core_device_current_unit_symbol (current_unit_symbol),
  KEY idx_core_device_device_type_id (device_type_id),
  KEY idx_core_device_encryption_profile_id (encryption_profile_id),
  KEY idx_core_device_lifecycle_status (lifecycle_status),
  KEY idx_core_device_deleted_at (deleted_at),
  KEY idx_core_device_unit_lifecycle (current_unit_symbol, lifecycle_status),

  CONSTRAINT fk_core_device_device_type
    FOREIGN KEY (device_type_id) REFERENCES device_type(id)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,

  CONSTRAINT fk_core_device_encryption_profile
    FOREIGN KEY (encryption_profile_id) REFERENCES encryption_profile(id)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- MANUAL
-- ============================================================
CREATE TABLE device_manual (
  device_id                   BIGINT UNSIGNED NOT NULL,
  battery_valid_until         DATE NULL,
  battery_last_check          DATE NULL,
  encryption_actual_car       INT NULL,
  encryption_actual_simol     INT NULL,
  encryption_actual_period_code INT NULL,
  notes                       TEXT NULL,
  override_status             ENUM('FORCE_ELIGIBLE','FORCE_NOT_ELIGIBLE') NULL,
  override_reason             VARCHAR(200) NULL,
  created_at                  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at                  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (device_id),

  CONSTRAINT fk_device_manual_device
    FOREIGN KEY (device_id) REFERENCES core_device(id)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,

  CONSTRAINT chk_device_manual_override_reason
    CHECK (
      (override_status IS NULL AND override_reason IS NULL)
      OR (override_status IS NOT NULL AND override_reason IS NOT NULL)
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- IMPORT (CORE)
-- ============================================================
CREATE TABLE import_batch (
  id                        BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  -- exported_at = זמן ייצוא הקובץ
  exported_at               DATETIME NOT NULL,
  source_filename           VARCHAR(255) NOT NULL,

  total_rows                INT UNSIGNED NOT NULL DEFAULT 0,
  created_devices_count     INT UNSIGNED NOT NULL DEFAULT 0,
  updated_devices_count     INT UNSIGNED NOT NULL DEFAULT 0,
  unchanged_count           INT UNSIGNED NOT NULL DEFAULT 0,
  missing_from_import_count INT UNSIGNED NOT NULL DEFAULT 0,
  errors_count              INT UNSIGNED NOT NULL DEFAULT 0,

  created_by_user_id        INT NULL,
  created_at                DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at              DATETIME NULL,

  PRIMARY KEY (id),
  KEY idx_import_batch_exported_at (exported_at),
  KEY idx_import_batch_created_at (created_at),
  KEY idx_import_batch_created_by (created_by_user_id),

  CONSTRAINT fk_import_batch_created_by_user
    FOREIGN KEY (created_by_user_id) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE sap_snapshot (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  import_batch_id BIGINT UNSIGNED NOT NULL,

  serial          VARCHAR(128) NOT NULL,
  makat           VARCHAR(64)  NOT NULL,
  device_name     VARCHAR(191) NOT NULL,
  qty             INT NOT NULL DEFAULT 1,
  unit_symbol     VARCHAR(64)  NOT NULL,

  location        VARCHAR(191) NULL,
  holder          VARCHAR(191) NULL,
  status_in_sap   VARCHAR(191) NULL,

  -- exported_at = זמן כפי שמופיע בשורה (אם קיים)
  exported_at     DATETIME NOT NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  KEY idx_sap_snapshot_import_batch (import_batch_id),
  KEY idx_sap_snapshot_serial (serial),
  KEY idx_sap_snapshot_makat (makat),
  KEY idx_sap_snapshot_unit_symbol (unit_symbol),
  KEY idx_sap_snapshot_exported_at (exported_at),

  CONSTRAINT fk_sap_snapshot_import_batch
    FOREIGN KEY (import_batch_id) REFERENCES import_batch(id)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,

  CONSTRAINT chk_sap_snapshot_qty_positive
    CHECK (qty > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- ELIGIBILITY (CORE)
-- ============================================================
CREATE TABLE eligibility_result (
  id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  device_id            BIGINT UNSIGNED NOT NULL,
  computed_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_eligible          BOOLEAN NOT NULL,
  summary_text         VARCHAR(255) NULL,
  computed_by_user_id  INT NULL,

  PRIMARY KEY (id),
  KEY idx_eligibility_result_device (device_id, computed_at),
  KEY idx_eligibility_result_is_eligible (is_eligible),
  KEY idx_eligibility_result_user (computed_by_user_id),

  CONSTRAINT fk_eligibility_result_device
    FOREIGN KEY (device_id) REFERENCES core_device(id)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,

  CONSTRAINT fk_eligibility_result_user
    FOREIGN KEY (computed_by_user_id) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- AUDIT (CORE)
-- ============================================================
CREATE TABLE audit_log (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  entity_type   VARCHAR(40) NOT NULL,
  entity_id     VARCHAR(64) NOT NULL,
  action        VARCHAR(40) NOT NULL,
  actor_user_id INT NULL,
  occurred_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  diff_json     TEXT NOT NULL,
  note          VARCHAR(200) NULL,

  PRIMARY KEY (id),
  KEY idx_audit_log_entity (entity_type, entity_id, occurred_at),
  KEY idx_audit_log_actor (actor_user_id, occurred_at),
  KEY idx_audit_log_action (action, occurred_at),

  CONSTRAINT fk_audit_log_actor
    FOREIGN KEY (actor_user_id) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- RELATIONS / CHILD TABLES
-- ============================================================
CREATE TABLE device_override_history (
  id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  device_id          BIGINT UNSIGNED NOT NULL,
  override_status    ENUM('FORCE_ELIGIBLE','FORCE_NOT_ELIGIBLE') NOT NULL,
  override_reason    VARCHAR(200) NOT NULL,
  created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by_user_id INT NULL,

  PRIMARY KEY (id),
  KEY idx_device_override_history_device (device_id, created_at),
  KEY idx_device_override_history_user (created_by_user_id),

  CONSTRAINT fk_device_override_history_device
    FOREIGN KEY (device_id) REFERENCES core_device(id)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,

  CONSTRAINT fk_device_override_history_user
    FOREIGN KEY (created_by_user_id) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE device_attachment (
  id                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  device_id           BIGINT UNSIGNED NOT NULL,
  storage_key         VARCHAR(255) NOT NULL,
  filename            VARCHAR(255) NOT NULL,
  mime_type           VARCHAR(120) NULL,
  file_size_bytes     BIGINT NULL,
  checksum_sha256     CHAR(64) NULL,
  uploaded_at         DATETIME NOT NULL,
  uploaded_by_user_id INT NULL,
  is_deleted          BOOLEAN NOT NULL DEFAULT FALSE,

  PRIMARY KEY (id),
  UNIQUE KEY uk_device_attachment_storage_key (storage_key),
  KEY idx_device_attachment_device (device_id, is_deleted, uploaded_at),
  KEY idx_device_attachment_uploaded_by (uploaded_by_user_id),

  CONSTRAINT fk_device_attachment_device
    FOREIGN KEY (device_id) REFERENCES core_device(id)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,

  CONSTRAINT fk_device_attachment_user
    FOREIGN KEY (uploaded_by_user_id) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE device_tag (
  device_id          BIGINT UNSIGNED NOT NULL,
  tag_id             BIGINT UNSIGNED NOT NULL,
  created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by_user_id INT NULL,

  PRIMARY KEY (device_id, tag_id),
  KEY idx_device_tag_tag_id (tag_id),
  KEY idx_device_tag_created_by (created_by_user_id),

  CONSTRAINT fk_device_tag_device
    FOREIGN KEY (device_id) REFERENCES core_device(id)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,

  CONSTRAINT fk_device_tag_tag
    FOREIGN KEY (tag_id) REFERENCES tag(id)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,

  CONSTRAINT fk_device_tag_user
    FOREIGN KEY (created_by_user_id) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE sap_snapshot_raw_column (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  sap_snapshot_id BIGINT UNSIGNED NOT NULL,
  column_name     VARCHAR(128) NOT NULL,
  column_value    TEXT NULL,

  PRIMARY KEY (id),
  UNIQUE KEY uk_sap_snapshot_raw_column (sap_snapshot_id, column_name),
  KEY idx_sap_snapshot_raw_column_name (column_name),

  CONSTRAINT fk_sap_snapshot_raw_column_snapshot
    FOREIGN KEY (sap_snapshot_id) REFERENCES sap_snapshot(id)
    ON DELETE CASCADE
    ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE import_row_error (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  import_batch_id BIGINT UNSIGNED NOT NULL,
  row_number      INT NOT NULL,
  serial          VARCHAR(80) NULL,
  error_code      VARCHAR(60) NOT NULL,
  error_message   VARCHAR(200) NOT NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  KEY idx_import_row_error_batch (import_batch_id),
  KEY idx_import_row_error_code (error_code),
  KEY idx_import_row_error_serial (serial),

  CONSTRAINT fk_import_row_error_batch
    FOREIGN KEY (import_batch_id) REFERENCES import_batch(id)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,

  CONSTRAINT fk_import_row_error_code
    FOREIGN KEY (error_code) REFERENCES import_error_code(code)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,

  CONSTRAINT chk_import_row_error_row_number
    CHECK (row_number > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE eligibility_reason (
  id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  eligibility_result_id BIGINT UNSIGNED NOT NULL,
  type                  ENUM('BLOCK','WARN') NOT NULL,
  code                  VARCHAR(60) NOT NULL,
  message               VARCHAR(200) NULL,

  PRIMARY KEY (id),
  UNIQUE KEY uk_eligibility_reason (eligibility_result_id, type, code),
  KEY idx_eligibility_reason_type_code (type, code),

  CONSTRAINT fk_eligibility_reason_result
    FOREIGN KEY (eligibility_result_id) REFERENCES eligibility_result(id)
    ON DELETE CASCADE
    ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
