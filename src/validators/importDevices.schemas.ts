import { z } from "zod";

export const lifecycleStatusSchema = z.enum(["NEW", "PEDDING", "ACTIVE", "NOT_ELIGIBLE", "TRANSFERRED", "REMOVED"]);

export const importInventoryRowSchema = z.object({
  serial: z.string().trim().min(1).max(128),
  makat: z.string().trim().min(1).max(64),
  device_name: z.string().trim().min(1).max(191),
  current_unit_symbol: z.string().trim().min(1).max(64),
});

export type ImportInventoryRow = z.infer<typeof importInventoryRowSchema>;
