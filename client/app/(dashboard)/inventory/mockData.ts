import { InventoryItem } from "@/types/dashboard";

export const DevicesTypes = [
  {
    type: "radio",
    items: ["מח 710", "מגן מכלול", "טל 88"],
  },
];

export const Devices = [
  {
    name: "מח 710",
    sku: "310902748",
    encryption: {
      type: "radio",
      tkofa: 960,
    },
  },
  {
    name: "טל 88",
    sku: "319667169",
    encryption: {
      type: "radio",
      tkofa: 960,
    },
  },
  {
    name: 'אול"ר רישתי',
    sku: "319658875",
    encryption: {
      type: "none",
      tkofa: 0,
    },
  },
  {
    name: 'מב"ן',
    sku: "310902683",
    encryption: {
      type: "zayad",
      tkofa: 49,
    },
  },
];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFutureDate(minDays = 30, maxDays = 900) {
  const d = new Date();
  d.setDate(d.getDate() + randomInt(minDays, maxDays));
  return d.toISOString().split("T")[0].split("-").reverse().join("/");
}

function randomStatus() {
  return Math.random() > 0.15 ? "good" : "bad";
}

export function generateInventory(count: number) {
  const result: InventoryItem[] = [];
  const usedCh = new Set<number>();

  for (let i = 0; i < count; i++) {
    const device = Devices[randomInt(0, Devices.length - 1)];

    let ch;
    do {
      ch = randomInt(400000, 999999);
    } while (usedCh.has(ch));

    usedCh.add(ch);

    let simol = "";
    // do {
    //   simol = String(randomInt(1000, 9999));
    // } while (usedCh.has(Number(simol)));

    if (device.encryption.type === "radio" && device.name === "טל 88") {
      simol = "7013";
    } else if (device.encryption.type === "radio" && device.name !== "טל 88") {
      simol = "6013";
    }
    // } else if (device.encryption.type === "zayad" && device.encryption.zahot === 'מב"ן') {
    //   simol = "9001";
    // }

    result.push({
      id: i + 1,
      name: device.name,
      sku: device.sku,
      chNumber: String(ch),
      encryption: {
        status: randomStatus(),
        type: device.encryption.type as "radio" | "zayad" | "none",
        tkofa: device.encryption.tkofa,
        simol: "",
        zahot: "",
        date: randomFutureDate(180, 1200),
      },
      batteryExpiry: randomFutureDate(90, 900),
      status: randomStatus(),
    });
  }

  for (let i = 0; i < result.length; i++) {
    if (result[i].name === "none") {
    }
  }
  return result;
}

// [
//     {
//         "id": 1,
//         "name": "מח 710",
//         "sku": "310902748",
//         "chNumber": "495412",
//         "encryption": {
//             "status": "good",
//             "type": "radio",
//             "tkofa": 960,
//             "simol": "",
//             "zahot": "",
//             "date": "05/03/2029"
//         },
//         "batteryExpiry": "21/02/2028",
//         "status": "good"
//     }
// ]
