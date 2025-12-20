import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// פונקציה ל-debounce (מונעת קריאות מרובות, שימושי לכפתורים/חיפוש)
export function debounce<T extends (...args: any[]) => any>(func: T, delay: number) {
  let timeoutId: NodeJS.Timeout;
  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// פונקציה ל-throttle (מגביל תדירות, שימושי ל-scroll/resize)
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number) {
  let lastCall = 0;
  return function (...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      func(...args);
    }
  };
}

// formatDate – פורמט תאריך (שימושי לטבלאות)
export function formatDate(date: Date | string, format: "short" | "long" = "short"): string {
  const d = new Date(date);
  if (format === "short") return d.toLocaleDateString("he-IL");
  return d.toLocaleString("he-IL");
}

// formatCurrency – פורמט כסף (ILS)
export function formatCurrency(amount: number, currency = "ILS"): string {
  return amount.toLocaleString("he-IL", { style: "currency", currency });
}

// sanitizeInput – ניקוי קלט (מגן על XSS)
export function sanitizeInput(input: string): string {
  return input.replace(/<script>|<\/script>/gi, "").replace(/<|>/g, "");
}

// abbreviateNumber – קיצור מספרים (1K, 1M)
export function abbreviateNumber(num: number): string {
  if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
  return num.toString();
}
// truncate – קיצור מחרוזת (עם ...)
export function truncate(text: string, length: number = 50): string {
  return text.length > length ? text.substring(0, length) + "..." : text;
}

// getErrorMessage – טיפול שגיאות (שימושי לAPI)
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

// generateUuid – יצירת ID ייחודי
export function generateUuid(): string {
  return crypto.randomUUID();
}
