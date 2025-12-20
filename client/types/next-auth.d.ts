// types/next-auth.d.ts
import type NextAuth from "next-auth";

export type Role = "user" | "admin" | null;

declare module "next-auth" {
  interface User {
    id: string;
    first_name?: string | null;
    last_name?: string | null;
    username: string;
    email?: string | null;
    role: Role;
    ac_token?: string;
    rf_token?: string;
  }

  interface Session {
    user: {
      id: string;
      first_name?: string | null;
      last_name?: string | null;
      username: string;
      email?: string | null;
      role: Role;
    };
    ac_token?: string;
    rf_token?: string;
    error?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    first_name?: string | null;
    last_name?: string | null;
    username: string;
    email?: string | null;
    role: Role;
    ac_token?: string;
    rf_token?: string;
    expires?: number;
    error?: string;
  }
}
