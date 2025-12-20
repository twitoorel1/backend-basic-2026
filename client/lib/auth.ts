import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { NextResponse } from "next/server";

import type { User } from "next-auth";

export async function getCurrentUser(): Promise<User | null> {
  const session = await getServerSession(authOptions);
  return session?.user;
}

// אם אתה משתמש ב-API routes – עדיף ככה (מחזיר 401 יפה)
export async function requireAuthApi() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  return { user };
}

// אם אתה משתמש ב-server components רגילים (כמו page.tsx) – ככה
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}
