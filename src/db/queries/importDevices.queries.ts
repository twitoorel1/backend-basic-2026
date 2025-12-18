import type { Pool, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import type { ImportInventoryRow } from "../../validators/importDevices.schemas.js";
import { DeviceTypeCode } from "../../types/imports.js";

export async function loadDeviceTypeMap(pool: Pool): Promise<Map<DeviceTypeCode, number>> {
  const [rows] = await pool.query<(RowDataPacket & { id: number; code: DeviceTypeCode })[]>("SELECT id, code FROM device_type");
  const map = new Map<DeviceTypeCode, number>();
  for (const r of rows) map.set(r.code, Number(r.id));
  return map;
}

export async function getCoreDeviceStateBySerial(pool: Pool, serial: string): Promise<null | { id: number; deleted_at: string | null; lifecycle_status: string }> {
  const [rows] = await pool.query<(RowDataPacket & { id: number; deleted_at: string | null; lifecycle_status: string })[]>("SELECT id, deleted_at, lifecycle_status FROM core_device WHERE serial = ? LIMIT 1", [serial]);
  return rows[0] ? { id: Number(rows[0].id), deleted_at: rows[0].deleted_at, lifecycle_status: rows[0].lifecycle_status } : null;
}

export async function insertCoreDevice(pool: Pool, row: ImportInventoryRow, deviceTypeId: number): Promise<void> {
  await pool.query<ResultSetHeader>(
    `
    INSERT INTO core_device
      (serial, makat, device_name, current_unit_symbol, device_type_id, encryption_profile_id, lifecycle_status)
    VALUES
      (?, ?, ?, ?, ?, NULL, 'NEW')
    `,
    [row.serial, row.makat, row.device_name, row.current_unit_symbol, deviceTypeId]
  );
}

export async function updateCoreDeviceInventoryOnly(pool: Pool, row: ImportInventoryRow): Promise<"updated" | "unchanged"> {
  const [res] = await pool.query<ResultSetHeader>(
    `
    UPDATE core_device
    SET
      makat = ?,
      device_name = ?,
      current_unit_symbol = ?,
      lifecycle_status = CASE
        WHEN lifecycle_status = 'REMOVED' THEN 'ACTIVE'
        ELSE lifecycle_status
      END
    WHERE serial = ? AND deleted_at IS NULL
    `,
    [row.makat, row.device_name, row.current_unit_symbol, row.serial]
  );

  return res.affectedRows > 0 ? "updated" : "unchanged";
}

export async function markRemovedMissingSerials(pool: Pool, presentSerials: string[]): Promise<number> {
  if (presentSerials.length === 0) return 0;

  const CHUNK = 800;
  let totalMarked = 0;

  const [countRows] = await pool.query<(RowDataPacket & { total: number })[]>("SELECT COUNT(*) AS total FROM core_device WHERE deleted_at IS NULL AND serial IS NOT NULL");
  const total = Number(countRows[0]?.total ?? 0);

  if (total === 0) return 0;

  const chunks: string[][] = [];
  for (let i = 0; i < presentSerials.length; i += CHUNK) {
    const part = presentSerials.slice(i, i + CHUNK);
    if (part.length > 0) chunks.push(part);
  }

  if (chunks.length === 0) return 0;

  if (chunks.length === 1) {
    const params = chunks[0];
    if (!params || params.length === 0) return 0;

    const [res] = await pool.query<ResultSetHeader>(
      `
      UPDATE core_device
      SET lifecycle_status = 'REMOVED'
      WHERE deleted_at IS NULL
        AND serial NOT IN (${params.map(() => "?").join(",")})
        AND lifecycle_status <> 'REMOVED'
      `,
      params
    );
    return Number(res.affectedRows ?? 0);
  }

  const tmpSerials = new Set(presentSerials);

  const [serialRows] = await pool.query<(RowDataPacket & { serial: string })[]>("SELECT serial FROM core_device WHERE deleted_at IS NULL");

  const toRemove: string[] = [];
  for (const r of serialRows) {
    const s = String(r.serial);
    if (!tmpSerials.has(s)) toRemove.push(s);
  }

  for (let i = 0; i < toRemove.length; i += CHUNK) {
    const part = toRemove.slice(i, i + CHUNK);
    const [res] = await pool.query<ResultSetHeader>(
      `
      UPDATE core_device
      SET lifecycle_status = 'REMOVED'
      WHERE deleted_at IS NULL
        AND serial IN (${part.map(() => "?").join(",")})
        AND lifecycle_status <> 'REMOVED'
      `,
      part
    );
    totalMarked += Number(res.affectedRows ?? 0);
  }

  return totalMarked;
}
