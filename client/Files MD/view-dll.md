## users

1. מטרה: טבלת משתמשי השרת – זהות, הרשאות (role), סטטוס פעילות, וסיסמה מוצפנת (hash).
2. נכתבת ב: Register, עדכון פרופיל/הרשאות ע״י ADMIN, עדכון `last_login_at` בעת Login.
3. נקראת ב: Login, בדיקות הרשאה (RBAC) לכל בקשה, ניהול משתמשים, ולוגים/רישום פעולות (דרך FK בטבלאות אחרות).
4. חובה/אופציונלית: **חובה**.
5. תלות SAP: **לא תלויה**. רלוונטית בכל מצב.

## refresh_tokens

1. מטרה: ניהול Refresh Tokens (hash + תוקף + revoke) לסשנים של Credentials+JWT.
2. נכתבת ב: Login (יצירה), Refresh (רוטציה/יצירה + revoke לקודם), Logout (revoke), ניקוי/סגירה למשתמש מושבת.
3. נקראת ב: Refresh flow (ולידציה), בדיקות אבטחה/סשנים, תחקור תקריות.
4. חובה/אופציונלית: **חובה** לפי החלטת AUTH.
5. תלות SAP: **לא תלויה**.

## device_type

1. מטרה: מילון סוגי מכשיר (RADIO/ZIAD/MOBILITY/OTHER) לשיוך חובה לכל מכשיר.
2. נכתבת ב: ניהול מערכת (Admin seed/maintenance).
3. נקראת ב: תהליך ייבוא (נגזרת סוג), מסכי סינון/דוחות, חישובי כשירות (אזהרות/לוגיקה עקיפה).
4. חובה/אופציונלית: **חובה** (כי `core_device.device_type_id` NOT NULL).
5. תלות SAP: **לא תלויה**; רלוונטית לייבוא קובץ בלבד.

## device_type_mapping

1. מטרה: חוקים לקביעת `device_type` אוטומטית לפי `makat` (exact) או `device_name` (contains) עם priority.
2. נכתבת ב: ניהול מערכת (Admin מגדיר חוקים/עדיפויות).
3. נקראת ב: Flow הייבוא (mapping), כלי תחקור/QA של ייבוא.
4. חובה/אופציונלית: **חובה תפקודית** כדי להפיק `device_type` אוטומטית; גם אם ריק, המערכת עדיין חייבת לעבוד עם ברירת מחדל OTHER (אבל החוקים עצמם הם כלי תפעולי חשוב).
5. תלות SAP: **לא תלויה**; נועדה לייבוא קובץ.

## encryption_profile

1. מטרה: “הצפנה צפויה” לפי device_family (כר/סימול/תקופה) וכללי period_mode, לשימוש בבדיקות כשירות.
2. נכתבת ב: ניהול מערכת (Admin מגדיר פרופילים).
3. נקראת ב: חישובי כשירות (ENCRYPTION_MISMATCH / PERIOD_MISMATCH), תצוגה בכרטיס מכשיר.
4. חובה/אופציונלית: **אופציונלית סכמתית** (FK ב־`core_device` nullable), אבל **מהותית** אם הכשירות תלויה בבדיקות הצפנה.
5. תלות SAP: **לא תלויה**; רלוונטית גם בלי SAP חי (כי אין).

## tag

1. מטרה: מילון תגיות גלובלי (lowercase policy) לסיווג מהיר של מכשירים.
2. נכתבת ב: UI (יצירת תג), Admin (ניהול).
3. נקראת ב: סינון/דוחות/חיפוש לפי תגיות.
4. חובה/אופציונלית: **אופציונלית** (שכבת ארגון).
5. תלות SAP: **לא תלויה**.

## import_error_code

1. מטרה: טבלת lookup לקודי שגיאות ייבוא (מוגדרים מראש).
2. נכתבת ב: תהליך Seed/ניהול מערכת (הזנת הקודים).
3. נקראת ב: Flow הייבוא (שגיאות), UI של דו״חות ייבוא.
4. חובה/אופציונלית: **חובה** כדי לרשום שגיאות לפי spec (import_row_error FK).
5. תלות SAP: **לא תלויה**; רלוונטית לייבוא קובץ.

## core_device

1. מטרה: טבלת הליבה של המכשירים – זהות (serial), פרטים שמגיעים מהייבוא, שיוך סוג מכשיר, סטטוס מחזור חיים.
2. נכתבת ב: Flow הייבוא (upsert לפי serial; עדכון makat/device_name/current_unit_symbol), ו-UI/תהליכים תפעוליים שמעדכנים lifecycle_status (לפי המוצר).
3. נקראת ב: כל מסכי המערכת (רשימות/כרטיס), חישובי כשירות, דוחות, אימותים בהעלאות/תיוג/קבצים.
4. חובה/אופציונלית: **חובה** (זה הבסיס).
5. תלות SAP: **לא**. השדות “SAP” מגיעים מקובץ; אין SAP API חי.

## device_manual

1. מטרה: “כרטיס ידני” שלא נדרס ע״י ייבוא – שדות סוללה/הצפנה בפועל/notes + override לתצוגת כשירות.
2. נכתבת ב: UI עריכה ידנית, תהליך override set/clear.
3. נקראת ב: כרטיס מכשיר, חישובי כשירות (סוללה/הצפנה בפועל, ועוד), תצוגת override.
4. חובה/אופציונלית: **אופציונלית** (אבל מאוד שימושית/מרכזית לתפעול; המערכת עדיין יכולה לעבוד בלי נתונים ידניים).
5. תלות SAP: **לא תלויה**.

## import_batch

1. מטרה: ריצת ייבוא אחת (CSV/XLSX) כולל exported_at (זמן ייצוא הקובץ) ומדדי דו״ח (counts).
2. נכתבת ב: Flow הייבוא (ידני/מתוזמן) – יצירה בתחילת ריצה, עדכון counts בסיום.
3. נקראת ב: מסך היסטוריית ייבוא, דוחות, תחקור שגיאות, מעקב תפעולי.
4. חובה/אופציונלית: **חובה** לפי Spec (כי יש דרישות דו״ח ייבוא וספירות).
5. תלות SAP: **לא**. מותאמת לייבוא קובץ בלבד (וזה המצב שלך).

## sap_snapshot

1. מטרה: צילום שורת נתוני הייבוא כפי שנקלטו (serial/makat/name/qty/unit_symbol + optional location/holder/status), כולל exported_at כפי שמופיע בשורה (אם קיים).
2. נכתבת ב: Flow הייבוא (parse/normalize) עבור כל שורה.
3. נקראת ב: כרטיס מכשיר (תצוגת נתוני ייבוא), תחקור ייבוא, בדיקות איכות נתונים, דוחות.
4. חובה/אופציונלית: **חובה** לפי Spec (שמירה של נתוני ייבוא ומידע לשחזור/תחקור).
5. תלות SAP: **לא**. למרות השם “sap\_”, היא רלוונטית לחלוטין לייבוא קובץ בלבד. אין כאן אינטגרציה חיה.

## eligibility_result

1. מטרה: תוצאת חישוב כשירות למכשיר בזמן נתון (computed_at, eligible, summary, מי חישב).
2. נכתבת ב: Flow Recalculate (ידני או מתוזמן), ולעתים לאחר ייבוא אם כך מוגדר ב-flow.
3. נקראת ב: דשבורד/רשימות, כרטיס מכשיר, דוחות והתראות.
4. חובה/אופציונלית: **אופציונלית** (אם לא מפעילים מודול כשירות, אפשר בלעדיה), אך לפי ה-Spec זה רכיב ליבה של המערכת – בפועל **נחשבת חובה פונקציונלית**.
5. תלות SAP: **לא תלויה**.

## audit_log

1. מטרה: Audit trail של פעולות/שינויים במערכת עם diff_json (מאושר) לתחקור ובקרה.
2. נכתבת ב: כל flow שמבצע שינוי משמעותי (ייבוא, עריכות ידניות, overrides, ניהול חוקים/תגיות/קבצים, ניהול משתמשים).
3. נקראת ב: מסך Audit, תחקור אירועים, ביקורות אבטחה/משילות.
4. חובה/אופציונלית: **לרוב חובה במערכת קריטית**; לפי Spec/Appendix היא מוגדרת כרכיב נדרש של audit.
5. תלות SAP: **לא תלויה**.

## device_override_history

1. מטרה: היסטוריית overrides (FORCE_ELIGIBLE / FORCE_NOT_ELIGIBLE) עם מי/מתי/סיבה.
2. נכתבת ב: Flow override set/clear (במקביל לעדכון device_manual).
3. נקראת ב: כרטיס מכשיר (היסטוריה), תחקור וביקורת.
4. חובה/אופציונלית: **אופציונלית**, אבל נדרשת אם רוצים היסטוריה לפי החלטה שננעלה.
5. תלות SAP: **לא תלויה**.

## device_attachment

1. מטרה: מטאדאטה של קבצים מצורפים למכשיר (storage_key, checksum, soft-delete).
2. נכתבת ב: Upload/Attach flow, מחיקה לוגית (is_deleted).
3. נקראת ב: כרטיס מכשיר (רשימת קבצים), תחקור/audit.
4. חובה/אופציונלית: **אופציונלית** (אם לא משתמשים בצירופים).
5. תלות SAP: **לא תלויה**.

## device_tag

1. מטרה: קשר many-to-many בין מכשירים לתגיות + מי יצר ומתי.
2. נכתבת ב: UI תיוג מכשיר, כלים תפעוליים.
3. נקראת ב: סינון/חיפוש/דוחות לפי תגיות.
4. חובה/אופציונלית: **אופציונלית** (תלוי שימוש בתגיות).
5. תלות SAP: **לא תלויה**.

## sap_snapshot_raw_column

1. מטרה: שמירת עמודות נוספות מהקובץ (מעבר למינימום), כ-raw per snapshot, בלי להשפיע על מודל ליבה.
2. נכתבת ב: Import parse כאשר קיימות עמודות extra.
3. נקראת ב: תחקור/QA של ייבוא, תצוגה “Raw columns” בכרטיס/דוח.
4. חובה/אופציונלית: **אופציונלית** (אם לא נדרשות עמודות נוספות).
5. תלות SAP: **לא תלויה**; רלוונטית במיוחד לייבוא קובץ.

## import_row_error

1. מטרה: שגיאות ייבוא ברמת שורה (row_number, serial אם קיים, error_code, message).
2. נכתבת ב: Flow validate/normalize של הייבוא.
3. נקראת ב: דו״חות ייבוא, ניהול תקלות, שיפור mapping/rules.
4. חובה/אופציונלית: **חובה** לפי דרישות דו״ח הייבוא.
5. תלות SAP: **לא תלויה**; רלוונטית לייבוא קובץ.

## eligibility_reason

1. מטרה: פירוט חסמים/אזהרות (BLOCK/WARN) עבור eligibility_result ללא JSON, עם ייחודיות לתוצאה.
2. נכתבת ב: Eligibility engine בעת חישוב.
3. נקראת ב: UI (פירוט סיבות), דוחות ותחקור.
4. חובה/אופציונלית: **אופציונלית יחד עם מודול הכשירות**, אך נדרשת אם משתמשים ב-eligibility_result לפי Spec.
5. תלות SAP: **לא תלויה**.

```md
=== SUMMARY_MD ===

# convo-summary.md

## Date + Version

- Date: 2025-12-16
- Version: Full project DDL locked (Spec v1.0 + Appendices A–F locked + AUTH locked)

## What changed

- DB walkthrough delivered: table-by-table purpose, write flows, read flows, required vs optional, and SAP relevance clarified for file-import-only environment.

## Artifacts

- Documentation-only output: DB walkthrough of tables (no code generated).

## Open Questions

- None raised in this walkthrough step.

## Next Steps

1. Map each backend endpoint/cron flow to the exact tables it touches (write/read) for implementation checklist.
2. Define operational runbooks: import schedule, eligibility recalculation schedule, and audit review process.
3. Proceed to API design walkthrough aligned to the DB entities and flows.

## Copy-paste links/refs

- Tables: users, refresh_tokens, device_type, device_type_mapping, encryption_profile, tag, import_error_code, core_device, device_manual, import_batch, sap_snapshot, eligibility_result, audit_log, device_override_history, device_attachment, device_tag, sap_snapshot_raw_column, import_row_error, eligibility_reason
```
