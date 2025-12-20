# SPECIFICATION DOCUMENT

## מערכת לניהול מחסן צופן חטיבתי

**Version:** 1.0  
**Status:** Approved for Development

---

## 1. Executive Summary

מערכת זו נועדה לנהל מחסן צופן חטיבתי הכולל מכשירים קריפטוגרפיים רגישים (רדיו, צי"ד, מוביליטי).
המערכת מספקת ניהול כרטיסי מכשיר, בדיקות כשירות, ייבוא מלאי מ-SAP ושמירה על Audit מלא.

---

## 2. Scope

### In Scope

- ניהול כרטיס מכשיר (Device Card)
- ייבוא קבצי SAP
- מנוע חוקים לכשירות
- הרשאות ואודיט

### Out of Scope

- חיבור ישיר ל-SAP
- תקשורת עם מכשירי הצופן
- ניהול כספי

---

## 3. Terminology

| מונח   | פירוש              |
| ------ | ------------------ |
| Serial | מספר סידורי ייחודי |
| מק"ט   | מספר קטלוגי        |
| כר     | מזהה הצפנה         |
| סימול  | מזהה יחידה         |
| תקופה  | חלון הצפנה         |
| כשירות | סטטוס מבצעי        |

---

## 4. Architecture

- Frontend: Next.js 16, TypeScript, Tailwind, shadcn
- Backend: Node.js, Express, TypeScript
- DB: MySQL 8
- Auth: NextAuth

---

## 5. Domain Model

- Device
- DeviceType
- EncryptionProfile
- SAPSnapshot
- DeviceManualData
- EligibilityResult
- ImportBatch
- AuditLog

---

## 6. Device Lifecycle

NEW → PENDING_CARD → ACTIVE → NOT_ELIGIBLE → TRANSFERRED / REMOVED

---

## 7. Data Separation

- device_core – זהות וסטטוס
- sap_snapshot – נתוני SAP בלבד
- device_manual – נתונים ידניים
- eligibility_result – חישוב כשירות

ייבוא אינו דורך נתונים ידניים.

---

## 8. Import Flow

1. Upload
2. Parse
3. Validate
4. Normalize
5. Match by Serial
6. Upsert
7. Detect missing devices
8. Report
9. Save batch

---

## 9. Eligibility Rules

- בדיקת התאמת כר / סימול
- בדיקת תקופה
- בדיקת תוקף סוללה (>= שנה)

Output:

```json
{
  "isEligible": false,
  "blockingReasons": ["BATTERY_EXPIRED"],
  "warnings": []
}
```

---

## 10. API (High Level)

- GET /devices
- GET /devices/:id
- PUT /devices/:id/manual
- POST /imports
- GET /imports/:id/report
- POST /eligibility/recalculate

---

## 11. RBAC

- Viewer – צפייה
- Editor – עריכה
- Admin – ייבוא, חוקים, משתמשים

---

## 12. UI

- Dashboard
- Device List
- Device Card
- Import History
- Alerts

---

## 13. Automation

- Cron 10:00, 19:00
- Retry x3
- Lock per import

---

## 14. Security & Audit

- Soft delete
- Audit לכל שינוי
- Least privilege

---

## 15. Roadmap

### MVP

- Devices
- Import
- Eligibility

### Phase 2

- Alerts
- Reports

### Phase 3

- BI
- Multi-unit

---

## 16. Assumptions

- פורמט SAP יציב
- Serial תמיד קיים

---

## 17. Open Questions

1. פורמט SAP?
2. שדות חובה?
3. טיפול בציוד מושאל?
