import type { Metadata } from "next";
import { heebo } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dashboard - לוח בקרה",
  description: "מערכת ניהול מקצועית",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className={heebo.className}>
        {children}
      </body>
    </html>
  );
}
