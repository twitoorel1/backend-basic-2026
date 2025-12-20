// app/layout.tsx

import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import { ThemeProvider } from "components/providers/ThemeProvider";
import "./globals.css";

const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rubik",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | ניהול מחסן",
    default: "ניהול מחסן",
  },
  description: "מערכת ניהול מלאי ומחסן מתקדמת",
  metadataBase: new URL("https://your-domain.com"),
  openGraph: {
    title: "ניהול מחסן",
    description: "מערכת ניהול מלאי ומחסן מתקדמת",
    type: "website",
    locale: "he_IL",
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl" className={rubik.variable} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        className={`
          font-sans            /* משתמש בפונט שהגדרנו */
          antialiased          /* פונטים חלקים ויפים */
          bg-background        /* רקע מה-CSS variables של Shadcn */
          text-foreground      /* צבע טקסט נכון */
          min-h-screen         /* שיהיה גובה מלא גם אם התוכן קצר */
        `}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
