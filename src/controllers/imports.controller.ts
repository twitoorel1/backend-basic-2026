import type { Request, Response, NextFunction } from "express";
import type { Pool } from "mysql2/promise";
import { AppError } from "../middleware/error.middleware.js";
import { importDevicesInventoryExcel } from "../services/imports/importDevices.service.js";

export function createImportsController(pool: Pool) {
  return {
    importDevices: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const file = (req as any).file as { path?: string } | undefined;
        if (!file?.path) {
          next(new AppError({ code: "VALIDATION_ERROR", status: 400, message: "Missing file: field named 'file'" }));
          return;
        }

        const result = await importDevicesInventoryExcel(pool, file.path);
        res.status(201).json(result);
      } catch (e) {
        next(e);
      }
    },
  };
}
