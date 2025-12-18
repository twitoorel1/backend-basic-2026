import type { Pool } from "mysql2/promise";
import type { DevicesListQuery } from "../../validators/devices.schemas.js";
import { countDevices, listDevices, getDeviceById } from "../../db/queries/devices.queries.js";

export async function getDevicesList(pool: Pool, q: DevicesListQuery) {
  const total = await countDevices(pool, q);
  const items = await listDevices(pool, q);
  const total_pages = Math.ceil(total / q.limit);

  return {
    items,
    page: q.page,
    limit: q.limit,
    total,
    total_pages,
  };
}

export async function getDeviceDetails(pool: Pool, id: number) {
  return getDeviceById(pool, id);
}
