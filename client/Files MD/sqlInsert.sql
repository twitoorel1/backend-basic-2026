-- Seed Examples (for understanding only) - NO DDL changes
-- Assumes IDs shown below are free in your DB. Adjust as needed.

-- ============================================================
-- AUTH
-- ============================================================

-- users
INSERT INTO users (id, first_name, last_name, username, email, password_hash, role, is_active, last_login_at, created_at, updated_at)
VALUES
  (1, 'Orel', 'Twito', 'orel', 'orel@tortime.co.il', '$2b$10$8oX4h2mYdZxk9qY0b5a5Uu5mZqZzq3qQwV4nR6cKp1x8s2nYd0e1K', 'ADMIN', TRUE, '2025-12-16 18:10:00', '2025-12-01 09:00:00', '2025-12-16 18:10:00'),
  (2, 'Noa', 'Levi', 'noa', 'noa@tortime.co.il', '$2b$10$hQp3qv4vYQGfP8m7VQnq0eJ4o2cYqVq1Pp3mYj2wRr1c2o9s0t1u2', 'EDITOR', TRUE, '2025-12-16 17:40:00', '2025-12-05 10:30:00', '2025-12-16 17:40:00');

-- refresh_tokens
INSERT INTO refresh_tokens (id, user_id, token_hash, issued_at, expires_at, revoked_at, user_agent, ip)
VALUES
  (1, 1, '0f2c8d3b5b6a48d9c1a2e0fbc4e67a2e3f1c0a9b8d7e6f5a4b3c2d1e0f9a8b7c', '2025-12-16 18:10:00', '2026-01-15 18:10:00', NULL, 'Chrome/143 Windows 10', '10.100.102.50'),
  (2, 2, 'a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8', '2025-12-16 17:40:00', '2026-01-15 17:40:00', NULL, 'Edge/120 Windows 11', '10.100.102.51');

-- ============================================================
-- RULES / LOOKUPS
-- ============================================================

-- device_type
INSERT INTO device_type (id, code, display_name, created_at, updated_at)
VALUES
  (1, 'RADIO', 'Radio Device', '2025-12-01 09:00:00', '2025-12-01 09:00:00'),
  (2, 'ZIAD', 'ZIAD Device', '2025-12-01 09:00:00', '2025-12-01 09:00:00'),
  (3, 'MOBILITY', 'Mobility System', '2025-12-01 09:00:00', '2025-12-01 09:00:00'),
  (4, 'OTHER', 'Other/Unknown', '2025-12-01 09:00:00', '2025-12-01 09:00:00');

-- device_type_mapping
-- Example 1: exact MAKAT match → RADIO
-- Example 2: NAME_CONTAINS match → ZIAD
INSERT INTO device_type_mapping (id, match_kind, match_value, device_type_id, priority, created_at, updated_at)
VALUES
  (1, 'MAKAT', '123-456-789', 1, 10, '2025-12-01 09:05:00', '2025-12-01 09:05:00'),
  (2, 'NAME_CONTAINS', 'ZIAD', 2, 50, '2025-12-01 09:06:00', '2025-12-01 09:06:00');

-- encryption_profile
-- Example: ROMACH family requires CAR + SIMOL + PERIOD (period_mode=ZIAD)
INSERT INTO encryption_profile (id, profile_name, device_family, expected_car, expected_simol, expected_period_code, period_mode, created_at, updated_at)
VALUES
  (1, 'ROMACH_DEFAULT', 'ROMACH', 12, 330, 49, 'ZIAD', '2025-12-01 09:10:00', '2025-12-01 09:10:00'),
  (2, 'MEDIA_BASIC', 'MEDIA', 5, NULL, NULL, 'NONE', '2025-12-01 09:11:00', '2025-12-01 09:11:00');

-- tag (Optional: only if you use tagging for ops/search)
INSERT INTO tag (id, name, created_at, updated_at)
VALUES
  (1, 'needs-review', '2025-12-02 08:00:00', '2025-12-02 08:00:00'),
  (2, 'battery-check', '2025-12-02 08:00:00', '2025-12-02 08:00:00');

-- import_error_code
INSERT INTO import_error_code (code, description)
VALUES
  ('MISSING_SERIAL', 'Row missing required serial value'),
  ('DUPLICATE_SERIAL_IN_FILE', 'Serial appears more than once in the same import file'),
  ('INVALID_QTY', 'Quantity is not a valid positive number'),
  ('INVALID_EXPORTED_AT', 'Exported timestamp is invalid'),
  ('UNKNOWN_DEVICE_TYPE', 'Device type mapping not found; defaulted to OTHER'),
  ('MISSING_REQUIRED_FIELD', 'A required field is missing');

-- ============================================================
-- DEVICES (CORE)
-- ============================================================

-- core_device
-- Device 5001: mapped as RADIO by MAKAT, with optional encryption_profile linked
-- Device 5002: unknown mapping → OTHER (you'd set device_type_id=4), no profile
INSERT INTO core_device (
  id, serial, makat, device_name, current_unit_symbol, device_type_id, encryption_profile_id,
  lifecycle_status, created_at, updated_at, deleted_at
) VALUES
  (5001, 'SN-IL-00981234', '123-456-789', 'TAL88 Secure Radio', '330', 1, 1, 'ACTIVE', '2025-12-15 08:10:00', '2025-12-16 12:00:00', NULL),
  (5002, 'SN-IL-00112233', '999-000-111', 'Unclassified Device Model X', '330', 4, NULL, 'PENDING_CARD', '2025-12-15 08:12:00', '2025-12-16 12:05:00', NULL);

-- ============================================================
-- MANUAL
-- ============================================================

-- device_manual
-- Device 5001 has real checks and actual encryption recorded (matches profile)
-- Device 5002 has incomplete manual fields (still valid)
INSERT INTO device_manual (
  device_id, battery_valid_until, battery_last_check,
  encryption_actual_car, encryption_actual_simol, encryption_actual_period_code,
  notes, override_status, override_reason, created_at, updated_at
) VALUES
  (5001, '2026-11-30', '2025-12-10', 12, 330, 49, 'בדיקה פיזית תקינה; הצפנה תואמת לפרופיל.', NULL, NULL, '2025-12-15 08:20:00', '2025-12-16 12:00:00'),
  (5002, NULL, NULL, NULL, NULL, NULL, 'ממתין להשלמת פרטים ידניים.', NULL, NULL, '2025-12-15 08:25:00', '2025-12-16 12:05:00');

-- device_override_history (Optional: only if you use override history)
INSERT INTO device_override_history (id, device_id, override_status, override_reason, created_at, created_by_user_id)
VALUES
  (1, 5002, 'FORCE_NOT_ELIGIBLE', 'חסר מידע קריטי; חסימה זמנית עד השלמה.', '2025-12-16 13:00:00', 1);

-- device_attachment (Optional: only if you attach files)
INSERT INTO device_attachment (
  id, device_id, storage_key, filename, mime_type, file_size_bytes, checksum_sha256,
  uploaded_at, uploaded_by_user_id, is_deleted
) VALUES
  (1, 5001, 'local://attachments/5001/battery-report-2025-12.pdf', 'battery-report-2025-12.pdf', 'application/pdf', 248991,
   'a3b1c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90123456789abcdef0123456789ab', '2025-12-16 13:10:00', 2, FALSE);

-- device_tag (Optional: only if you use tagging)
INSERT INTO device_tag (device_id, tag_id, created_at, created_by_user_id)
VALUES
  (5002, 1, '2025-12-16 13:20:00', 2),
  (5001, 2, '2025-12-16 13:21:00', 2);

-- ============================================================
-- IMPORT (CSV/XLSX file only)
-- ============================================================

-- import_batch
INSERT INTO import_batch (
  id, exported_at, source_filename,
  total_rows, created_devices_count, updated_devices_count, unchanged_count, missing_from_import_count, errors_count,
  created_by_user_id, created_at, completed_at
) VALUES
  (1001, '2025-12-16 07:55:00', 'sap_export_2025-12-16.csv',
   3, 1, 1, 1, 0, 1,
   1, '2025-12-16 08:00:00', '2025-12-16 08:02:30');

-- sap_snapshot
INSERT INTO sap_snapshot (
  id, import_batch_id,
  serial, makat, device_name, qty, unit_symbol,
  location, holder, status_in_sap,
  exported_at, created_at
) VALUES
  (2001, 1001, 'SN-IL-00981234', '123-456-789', 'TAL88 Secure Radio', 1, '330', 'מחסן מרכזי', 'גדוד 17', 'IN_SERVICE', '2025-12-16 07:55:00', '2025-12-16 08:00:40'),
  (2002, 1001, 'SN-IL-00112233', '999-000-111', 'Unclassified Device Model X', 1, '330', NULL, NULL, NULL, '2025-12-16 07:55:00', '2025-12-16 08:00:41');

-- sap_snapshot_raw_column (Optional: only if your file has extra columns)
INSERT INTO sap_snapshot_raw_column (id, sap_snapshot_id, column_name, column_value)
VALUES
  (1, 2001, 'supplier_batch', 'B-77192'),
  (2, 2001, 'project_code', 'PRJ-ACDC-01');

-- import_row_error
INSERT INTO import_row_error (id, import_batch_id, row_number, serial, error_code, error_message, created_at)
VALUES
  (1, 1001, 3, NULL, 'MISSING_SERIAL', 'serial is required but empty', '2025-12-16 08:01:10');

-- ============================================================
-- ELIGIBILITY
-- ============================================================

-- eligibility_result
-- 5001 eligible (matches encryption, battery OK)
-- 5002 not eligible (missing required data + forced override in display may apply in UI)
INSERT INTO eligibility_result (id, device_id, computed_at, is_eligible, summary_text, computed_by_user_id)
VALUES
  (9001, 5001, '2025-12-16 10:00:00', TRUE, 'Eligible', NULL),
  (9002, 5002, '2025-12-16 10:00:00', FALSE, 'Missing required data', NULL);

-- eligibility_reason
INSERT INTO eligibility_reason (id, eligibility_result_id, type, code, message)
VALUES
  (1, 9002, 'BLOCK', 'MISSING_REQUIRED_DATA', 'device_type=OTHER and manual card incomplete'),
  (2, 9002, 'WARN',  'UNKNOWN_DEVICE_TYPE', 'No mapping rule matched; defaulted to OTHER');

-- ============================================================
-- AUDIT
-- ============================================================

-- audit_log (diff_json is allowed)
INSERT INTO audit_log (id, entity_type, entity_id, action, actor_user_id, occurred_at, diff_json, note)
VALUES
  (1, 'IMPORT_BATCH', '1001', 'IMPORT', 1, '2025-12-16 08:02:30', '{"source_filename":{"from":null,"to":"sap_export_2025-12-16.csv"}}', 'Manual import completed'),
  (2, 'DEVICE_MANUAL', '5002', 'OVERRIDE_SET', 1, '2025-12-16 13:00:00', '{"override_status":{"from":null,"to":"FORCE_NOT_ELIGIBLE"},"override_reason":{"from":null,"to":"חסר מידע קריטי; חסימה זמנית עד השלמה."}}', 'Override set by admin');
