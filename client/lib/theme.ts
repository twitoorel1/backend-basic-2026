// lib/theme.ts – הקובץ היחיד שבו תשנה צבעים!
const palette = {
  primary: "#00bf7d", // ירוק-טורקיז – הצבע הראשי
  secondary: "#00b4c5", // טורקיז
  accent: "#0073e6", // כחול מלכותי
  info: "#2546f0", // כחול עמוק
  violet: "#5928ed", // סגול-לילך

  // צבעים קבועים (אפשר לשנות בעתיד)
  success: "#22c55e",
  warning: "#f59e0b",
  destructive: "#ef4444",
} as const;

// ייצוא ל-Tailwind (לשימוש ב-className)
export const tailwindColors = {
  primary: palette.primary,
  secondary: palette.secondary,
  accent: palette.accent,
  info: palette.info,
  violet: palette.violet,
  success: palette.success,
  warning: palette.warning,
  destructive: palette.destructive,

  // dark mode – אותם צבעים (נשארים חזקים גם בלילה)
  "primary-dark": palette.primary,
  "secondary-dark": palette.secondary,
  "accent-dark": palette.accent,
  "info-dark": palette.info,
  "violet-dark": palette.violet,
} as const;

// ייצוא ל-CSS variables (לשימוש ב-globals.css)
export const cssVariables = {
  "--primary": palette.primary,
  "--secondary": palette.secondary,
  "--accent": palette.accent,
  "--info": palette.info,
  "--violet": palette.violet,
  "--success": palette.success,
  "--warning": palette.warning,
  "--destructive": palette.destructive,

  // foreground – לבן על צבעים כהים
  "--primary-foreground": "#ffffff",
  "--secondary-foreground": "#ffffff",
  "--accent-foreground": "#ffffff",
  "--info-foreground": "#ffffff",
  "--violet-foreground": "#ffffff",
  "--success-foreground": "#ffffff",
  "--warning-foreground": "#1f2937",
  "--destructive-foreground": "#ffffff",
} as const;
