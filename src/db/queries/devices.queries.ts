import type { Pool, RowDataPacket } from "mysql2/promise";
import type { DevicesListQuery } from "../../validators/devices.schemas.js";

export type DeviceTypeRow = {
  id: number;
  code: string;
  display_name: string;
};

export type CoreDeviceRow = {
  id: number;
  serial: string;
  makat: string;
  device_name: string;
  current_unit_symbol: string;
  device_type: DeviceTypeRow;
  lifecycle_status: string;
  created_at: string;
  updated_at: string;
};

const SORT_COLUMN_MAP: Record<DevicesListQuery["sort_by"], string> = {
  updated_at: "d.updated_at",
  created_at: "d.created_at",
  device_name: "d.device_name",
  makat: "d.makat",
  serial: "d.serial",
};

export async function countDevices(pool: Pool, q: DevicesListQuery): Promise<number> {
  const { whereSql, params } = buildWhere(q);
  const [rows] = await pool.query<(RowDataPacket & { total: number })[]>(
    `
    SELECT COUNT(*) AS total
    FROM core_device d
    INNER JOIN device_type dt ON dt.id = d.device_type_id
    ${whereSql}
    `,
    params
  );

  return Number(rows[0]?.total ?? 0);
}

export async function listDevices(pool: Pool, q: DevicesListQuery): Promise<CoreDeviceRow[]> {
  const { whereSql, params } = buildWhere(q);

  const sortCol = SORT_COLUMN_MAP[q.sort_by];
  const sortDir = q.sort_order.toUpperCase() === "ASC" ? "ASC" : "DESC";
  const offset = (q.page - 1) * q.limit;

  const [rows] = await pool.query<
    (RowDataPacket & {
      id: number;
      serial: string;
      makat: string;
      device_name: string;
      current_unit_symbol: string;
      lifecycle_status: string;
      created_at: string;
      updated_at: string;
      dt_id: number;
      dt_code: string;
      dt_display_name: string;
    })[]
  >(
    `
    SELECT
      d.id,
      d.serial,
      d.makat,
      d.device_name,
      d.current_unit_symbol,
      d.lifecycle_status,
      d.created_at,
      d.updated_at,
      dt.id AS dt_id,
      dt.code AS dt_code,
      dt.display_name AS dt_display_name
    FROM core_device d
    INNER JOIN device_type dt ON dt.id = d.device_type_id
    ${whereSql}
    ORDER BY ${sortCol} ${sortDir}
    LIMIT ?
    OFFSET ?
    `,
    [...params, q.limit, offset]
  );

  return rows.map((r) => ({
    id: r.id,
    serial: r.serial,
    makat: r.makat,
    device_name: r.device_name,
    current_unit_symbol: r.current_unit_symbol,
    lifecycle_status: r.lifecycle_status,
    created_at: r.created_at,
    updated_at: r.updated_at,
    device_type: {
      id: r.dt_id,
      code: r.dt_code,
      display_name: r.dt_display_name,
    },
  }));
}

export async function getDeviceById(pool: Pool, id: number): Promise<CoreDeviceRow | null> {
  const [rows] = await pool.query<
    (RowDataPacket & {
      id: number;
      serial: string;
      makat: string;
      device_name: string;
      current_unit_symbol: string;
      lifecycle_status: string;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
      dt_id: number;
      dt_code: string;
      dt_display_name: string;
    })[]
  >(
    `
    SELECT
      d.id,
      d.serial,
      d.makat,
      d.device_name,
      d.current_unit_symbol,
      d.lifecycle_status,
      d.created_at,
      d.updated_at,
      d.deleted_at,
      dt.id AS dt_id,
      dt.code AS dt_code,
      dt.display_name AS dt_display_name
    FROM core_device d
    INNER JOIN device_type dt ON dt.id = d.device_type_id
    WHERE d.id = ?
    LIMIT 1
    `,
    [id]
  );

  const r = rows[0];
  if (!r) return null;
  if (r.deleted_at !== null) return null;

  return {
    id: r.id,
    serial: r.serial,
    makat: r.makat,
    device_name: r.device_name,
    current_unit_symbol: r.current_unit_symbol,
    lifecycle_status: r.lifecycle_status,
    created_at: r.created_at,
    updated_at: r.updated_at,
    device_type: {
      id: r.dt_id,
      code: r.dt_code,
      display_name: r.dt_display_name,
    },
  };
}

function buildWhere(q: DevicesListQuery): { whereSql: string; params: any[] } {
  const clauses: string[] = ["d.deleted_at IS NULL"];
  const params: any[] = [];

  if (q.search) {
    clauses.push("(d.serial LIKE ? OR d.makat LIKE ? OR d.device_name LIKE ?)");
    const like = `%${q.search}%`;
    params.push(like, like, like);
  }

  if (q.lifecycle_status) {
    clauses.push("d.lifecycle_status = ?");
    params.push(q.lifecycle_status);
  }

  return {
    whereSql: clauses.length ? `WHERE ${clauses.join(" AND ")}` : "",
    params,
  };
}
