import { Router, Request } from "express";
import multer from "multer";
import type { Pool } from "mysql2/promise";
import type { AppEnv } from "../config/env.js";
import { createAuthMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/rbac.middleware.js";
import { createImportsController } from "../controllers/imports.controller.js";
import { promises as fs } from "node:fs";
import path from "node:path";
import { Roles } from "../types/auth.js";

function uploadsDir() {
  return path.join(process.cwd(), "uploads", "imports");
}

async function ensureUploadsDir() {
  await fs.mkdir(uploadsDir(), { recursive: true });
}

async function safeUnlink(filePath: string) {
  try {
    await fs.unlink(filePath);
  } catch {
    return;
  }
}

export function createImportsRouter(pool: Pool, env: AppEnv) {
  const router = Router();
  const auth = createAuthMiddleware(env);
  const controller = createImportsController(pool);

  const storage = multer.diskStorage({
    destination: async (_req: Request, _file, cb) => {
      try {
        await ensureUploadsDir();
        cb(null, uploadsDir());
      } catch (e) {
        cb(e as Error, uploadsDir());
      }
    },
    filename: (_req: Request, file, cb) => {
      const safeName = `${Date.now()}-${file.originalname}`.replace(/[^\w.\-() ]+/g, "_");
      cb(null, safeName);
    },
  });

  const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
  });

  router.post("/imports/devices", auth, requireRole(Roles.ADMIN), upload.single("file"), async (req, res, next) => {
    const file = (req as any).file as { path?: string } | undefined;
    try {
      await controller.importDevices(req, res, next);
    } finally {
      if (file?.path) await safeUnlink(file.path);
    }
  });

  return router;
}
