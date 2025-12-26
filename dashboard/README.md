# Dashboard - לוח בקרה מקצועי

Dashboard מקצועי ומודרני בעברית עם תמיכת RTL מלאה, בנוי בסגנון Minimals.

## ✨ תכונות

- 🌐 **תמיכת RTL מלאה** - עברית מושלמת עם Logical Properties
- 🎨 **עיצוב Minimals** - נקי, מינימליסטי ומקצועי
- ⚡ **Next.js 15** - React 19 ו-App Router
- 🎭 **shadcn/ui** - קומפוננטות UI מודרניות
- 🎯 **TypeScript** - Type-safe לחלוטין
- 🌈 **Tailwind CSS** - Styling מהיר וגמיש

## 🏗️ מבנה הפרויקט

```
dashboard/
├── app/
│   ├── layout.tsx              # RTL layout עם dir="rtl" lang="he"
│   ├── globals.css             # Tailwind + shadcn variables
│   ├── page.tsx                # Redirect to /dashboard
│   └── dashboard/
│       ├── layout.tsx          # Dashboard layout עם Sidebar
│       └── page.tsx            # Dashboard main page
│
├── components/
│   ├── ui/                     # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   └── separator.tsx
│   │
│   └── dashboard/              # Custom dashboard components
│       ├── sidebar.tsx         # Sidebar עם navigation
│       ├── header.tsx          # Header עם search + user menu
│       ├── stat-card.tsx       # כרטיס סטטיסטיקה
│       ├── recent-activity.tsx # פעילות אחרונה
│       └── quick-actions.tsx   # פעולות מהירות
│
├── lib/
│   ├── utils.ts               # cn() utility
│   └── fonts.ts               # Hebrew fonts (Heebo)
│
└── ... (config files)
```

## 📦 טכנולוגיות

- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Re-usable components
- **Radix UI** - Accessible primitives
- **Lucide React** - Icons
- **Heebo Font** - Hebrew Google Font

## 🚀 התקנה

1. נווט לתיקיית הדשבורד:
```bash
cd dashboard
```

2. התקן את התלויות:
```bash
npm install
```

3. הרץ את שרת הפיתוח:
```bash
npm run dev
```

4. פתח את הדפדפן ב:
```
http://localhost:3000
```

## 🛠️ פקודות

- `npm run dev` - הרצת שרת פיתוח
- `npm run build` - בניית הפרויקט לפרודקשן
- `npm run start` - הרצת שרת פרודקשן
- `npm run lint` - בדיקת קוד

## 🎨 עיצוב

### צבעים וסגנון

הדשבורד משתמש בערכת צבעים מקצועית בסגנון Minimals:

- **Primary Gradient**: Purple to Blue (`#667eea` → `#764ba2`)
- **Success Gradient**: Light Green to Green (`#5BE584` → `#00AB55`)
- **Error Gradient**: Light Orange to Red (`#FFAC82` → `#FF5630`)
- **Info Gradient**: Light Blue to Blue (`#84D9FF` → `#1890FF`)

### RTL Support

כל הקומפוננטות משתמשות ב-Logical Properties:
- `ms-` / `me-` במקום `ml-` / `mr-`
- `ps-` / `pe-` במקום `pl-` / `pr-`
- `start-` / `end-` במקום `left-` / `right-`

## 📊 קומפוננטות Dashboard

### Sidebar
- ניווט בצד ימין
- 6 פריטי תפריט
- פרופיל משתמש בתחתית
- Hover effects ו-Active states

### Header
- Sticky header
- שדה חיפוש
- התראות עם badge
- תפריט משתמש

### Stat Cards
4 כרטיסי סטטיסטיקה:
1. סך הכנסות - ₪45,231 (+20.1%)
2. משתמשים פעילים - 2,350 (+15.3%)
3. הזמנות - 184 (-5.2%)
4. שיעור המרה - 3.24% (+8.1%)

### Recent Activity
רשימת פעילויות אחרונות עם:
- Avatar משתמש
- פרטי הפעולה
- סכום
- סטטוס (Badge)

### Quick Actions
4 כפתורי פעולה מהירות:
- הזמנה חדשה
- ייבוא נתונים
- ייצוא דוח
- רענן נתונים

## 🌐 תמיכה בדפדפנים

הדשבורד תומך בכל הדפדפנים המודרניים:
- Chrome
- Firefox
- Safari
- Edge

## 📄 רישיון

MIT

## 🤝 תרומה

תרומות מתקבלות בברכה! אנא פתח issue או PR.

## 📧 יצירת קשר

לשאלות ותמיכה, פנה ל: support@example.com
