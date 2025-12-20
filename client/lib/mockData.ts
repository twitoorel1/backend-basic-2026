// lib/mockItems.ts
import { format, addMonths, subMonths } from "date-fns";

export type Item = {
  id: string;
  serialNumber: string;
  description: string;
  manufactureDate: string;
  batteryExpiration: string;
  status: "expired" | "warning" | "good";
};

const generateSerial = () => `SN-${Math.floor(Math.random() * 999999)}`;

export const mockItems: Item[] = Array.from({ length: 120 }, (_, i) => {
  const daysUntilExpiration = Math.floor(Math.random() * 600) - 200; // מ-200 עד +400 ימים
  const expiration = new Date();
  expiration.setDate(expiration.getDate() + daysUntilExpiration);

  let status: "expired" | "warning" | "good" = "good";
  if (daysUntilExpiration < 0) status = "expired";
  else if (daysUntilExpiration < 60) status = "warning";

  return {
    id: `${i + 1}`,
    serialNumber: generateSerial(),
    description: `ציוד מספר ${i + 1} - תיאור לדוגמה`,
    manufactureDate: format(subMonths(new Date(), Math.floor(Math.random() * 24)), "dd/MM/yyyy"),
    batteryExpiration: format(expiration, "dd/MM/yyyy"),
    status,
  };
});
