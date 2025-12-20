"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useUserStore } from "@/stores/useUserStore";

export function UserSync() {
  const { data: session, status } = useSession();
  const { login, logout } = useUserStore();

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "authenticated" && session?.user) {
      login({
        id: session.user.id as string,
        first_name: session.user.first_name as string,
        last_name: session.user.last_name as string,
        username: session.user.username as string,
        email: session.user.email as string,
        role: session.user.role as "user" | "admin" | null,
      });
    } else if (status === "unauthenticated") {
      logout();
    }
  }, [session, status, login, logout]);

  return null;
}

// {
//     "user": {
//         "id": 1,
//         "first_name": "orel",
//         "last_name": "twito",
//         "username": "twitoorel1",
//         "email": "twitoorel1@gmail.com",
//         "role": "user",
//         "last_connected": "2025-12-13T15:20:12.000Z"
//     },
//     "expires": "2025-12-13T16:28:57.936Z",
//     "ac_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NjU2MzkyMjcsImV4cCI6MTc2NTY1NzIyN30.qk6SInGqiWaQsiIYemVYoYsikVjglDE2zyex4at9MxU",
//     "rf_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NjU2MzkyMjcsImV4cCI6MTc2NjI0NDAyN30.JtoVe7l_jNmKlwIWvPxDsF1-ReqIeabNwQNjr4NwhEE"
// }
