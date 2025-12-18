import type { Pool } from "mysql2/promise";
import * as XLSXNS from "xlsx";
const XLSX = (XLSXNS as unknown as { default?: typeof XLSXNS }).default ?? XLSXNS;
import { z } from "zod";
import { importInventoryRowSchema, type ImportInventoryRow } from "../../validators/importDevices.schemas.js";
import { deviceTypeByMakat } from "../../config/deviceTypeByMakat.js";
import { loadDeviceTypeMap, getCoreDeviceStateBySerial, insertCoreDevice, updateCoreDeviceInventoryOnly, markRemovedMissingSerials } from "../../db/queries/importDevices.queries.js";
import { AppError } from "../../middleware/error.middleware.js";
import { DeviceTypeCode } from "../../types/imports.js";

type ImportErrorItem = {
  row_number: number;
  serial?: string;
  code: string;
  message: string;
  fields?: Record<string, unknown>;
};

export type ImportDevicesResponse = {
  processed: number;
  inserted: number;
  updated: number;
  marked_removed: number;
  failed: number;
  errors: ImportErrorItem[];
};

const DeviceTypeCodeSchema = z.enum(DeviceTypeCode);

function normalizeHeader(v: unknown): string {
  return String(v ?? "")
    .trim()
    .toLowerCase()
    .replace(/[״”“„"]/g, '"')
    .replace(/[׳‘’]/g, "'")
    .replace(/\s+/g, " ");
}

const headerAliases: Record<string, keyof ImportInventoryRow> = {
  "מספר סיריאלי": "serial",
  "מספר סיראלי": "serial",
  serial: "serial",

  חומר: "makat",
  מקט: "makat",
  'מק"ט': "makat",
  "מק׳ט": "makat",
  "מק'ט": "makat",

  "תיאור החומר": "device_name",
  "שם פריט": "device_name",

  "אתר אחסון": "current_unit_symbol",
  אתר: "current_unit_symbol",
};

const requiredFields: (keyof ImportInventoryRow)[] = ["serial", "makat", "device_name", "current_unit_symbol"];

export async function importDevicesInventoryExcel(pool: Pool, filePath: string): Promise<ImportDevicesResponse> {
  const workbook = XLSX.readFile(filePath, { cellDates: true });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new AppError({
      code: "VALIDATION_ERROR",
      status: 400,
      message: "The Excel file does not contain any sheets (SheetNames is empty)",
    });
  }

  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    throw new AppError({
      code: "VALIDATION_ERROR",
      status: 400,
      message: "The first sheet in the file is not available for reading.",
    });
  }

  const rowsRaw = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: "" }) as unknown;

  if (!Array.isArray(rowsRaw) || rowsRaw.length === 0) {
    throw new AppError({
      code: "VALIDATION_ERROR",
      status: 400,
      message: "The first sheet is empty or not in a supported format.",
    });
  }

  const rows = rowsRaw as unknown[];

  const headerCandidate = rows[0];
  if (!Array.isArray(headerCandidate) || headerCandidate.length === 0) {
    throw new AppError({
      code: "VALIDATION_ERROR",
      status: 400,
      message: "Missing or empty header row on first sheet of the Excel file.",
    });
  }

  const headerRow = headerCandidate;

  const indexToField = new Map<number, keyof ImportInventoryRow>();
  const found = new Set<keyof ImportInventoryRow>();

  for (let i = 0; i < headerRow.length; i++) {
    const key = normalizeHeader(headerRow[i]);
    const mapped = headerAliases[key];
    if (!mapped) continue;
    indexToField.set(i, mapped);
    found.add(mapped);
  }

  const missingHeaders = requiredFields.filter((f) => !found.has(f));
  if (missingHeaders.length > 0) {
    return {
      processed: Math.max(rows.length - 1, 0),
      inserted: 0,
      updated: 0,
      marked_removed: 0,
      failed: Math.max(rows.length - 1, 0),
      errors: [
        {
          row_number: 1,
          code: "IMPORT_MISSING_HEADERS",
          message: "Missing required headers in the file",
          fields: { missing: missingHeaders },
        },
      ],
    };
  }

  const deviceTypeMap = await loadDeviceTypeMap(pool);

  let processed = 0;
  let inserted = 0;
  let updated = 0;
  let failed = 0;

  const errors: ImportErrorItem[] = [];
  const seenSerials = new Set<string>();
  const presentSerials: string[] = [];

  const dataRows = rows.slice(1);

  for (let r = 0; r < dataRows.length; r++) {
    const excelRowNumber = r + 2;

    const row = dataRows[r];
    if (!Array.isArray(row)) {
      continue;
    }

    const candidate: Record<string, unknown> = {};

    indexToField.forEach((field, idx) => {
      const v = row[idx];
      if (v === "" || v === null || v === undefined) return;
      candidate[field] = String(v).trim();
    });

    if (Object.keys(candidate).length === 0) continue;

    processed++;

    const parsed = importInventoryRowSchema.safeParse(candidate);
    if (!parsed.success) {
      failed++;
      errors.push({
        row_number: excelRowNumber,
        code: "ROW_VALIDATION_FAILED",
        message: "Row validation failed",
        fields: parsed.error.flatten(),
      });
      continue;
    }

    const data = parsed.data;

    if (seenSerials.has(data.serial)) {
      failed++;
      errors.push({
        row_number: excelRowNumber,
        serial: data.serial,
        code: "DUPLICATE_SERIAL_IN_FILE",
        message: "Duplicate serial number within the same file — skipping import.",
      });
      continue;
    }
    seenSerials.add(data.serial);
    presentSerials.push(data.serial);

    const state = await getCoreDeviceStateBySerial(pool, data.serial);

    if (state && state.deleted_at !== null) {
      failed++;
      errors.push({
        row_number: excelRowNumber,
        serial: data.serial,
        code: "SOFT_DELETED_DEVICE",
        message: "A device with the same serial exists but is soft-deleted (deleted_at not NULL) — skipping import.",
      });
      continue;
    }

    if (!state) {
      const makatKey = String(data.makat).trim();
      const mapped = deviceTypeByMakat[makatKey] ?? "OTHER";

      const typeParse = DeviceTypeCodeSchema.safeParse(mapped);
      if (!typeParse.success) {
        failed++;
        errors.push({
          row_number: excelRowNumber,
          serial: data.serial,
          code: "INVALID_DEVICE_TYPE_MAPPING",
          message: "The mapping makat -> device_type_code in the config is invalid.",
          fields: { makat: data.makat, mapped },
        });
        continue;
      }

      const deviceTypeId = deviceTypeMap.get(typeParse.data);
      if (!deviceTypeId) {
        failed++;
        errors.push({
          row_number: excelRowNumber,
          serial: data.serial,
          code: "DEVICE_TYPE_NOT_IN_DB",
          message: "The device type code from the mapping does not exist in the device_type table.",
          fields: { mapped_code: typeParse.data },
        });
        continue;
      }

      await insertCoreDevice(pool, data, deviceTypeId);
      inserted++;
      continue;
    }

    const op = await updateCoreDeviceInventoryOnly(pool, data);
    if (op === "updated") updated++;
  }

  let marked_removed = 0;
  try {
    marked_removed = await markRemovedMissingSerials(pool, presentSerials);
  } catch {
    errors.push({
      row_number: 0,
      code: "MARK_REMOVED_FAILED",
      message: "Marking REMOVED for devices not present in the file failed",
    });
  }

  return {
    processed,
    inserted,
    updated,
    marked_removed,
    failed,
    errors,
  };
}
