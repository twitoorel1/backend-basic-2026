// Inventory Page Types
export type Status = "good" | "warning" | "bad";
export type TypeEncryption = "radio" | "zayad" | "none";

export interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  chNumber: string;
  encryption: {
    status: Status;
    type: TypeEncryption;
    tkofa: number;
    simol: string;
    zahot: string;
    date: string;
  };
  batteryExpiry: string;
  status: Status;
}
