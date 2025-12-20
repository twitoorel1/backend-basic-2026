import { Role } from "@/types/next-auth";
import { create } from "zustand";
import { devtools, subscribeWithSelector, persist } from "zustand/middleware";

interface UserState {
  isLoggedIn: boolean;
  id: string | null;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  email: string | null;
  role: Role;

  login: (user: Partial<UserState>) => void;
  logout: () => void;
  // login: (data: { id: string; first_name?: string; last_name?: string; username?: string; email?: string; role?: Role }) => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    subscribeWithSelector((set) => ({
      // מצב התחלתי
      isLoggedIn: false,
      id: null,
      first_name: null,
      last_name: null,
      username: null,
      email: null,
      role: null,

      // התחברות – מעדכן את כל נתוני המשתמש
      login: (user) => {
        // ← כאן תראה בדיוק מה מגיע!
        console.log("Login In UseUserStore");
        // console.log("Login User Store:");
        // console.log("Zustand login called with:", user);
        set(
          {
            isLoggedIn: true,
            id: user.id,
            first_name: user.first_name ?? null,
            last_name: user.last_name ?? null,
            username: user.username ?? null,
            email: user.email ?? null,
            role: user.role ?? "user",
          },
          false,
          "user/login"
        );
      },

      // התנתקות – מנקה הכל ומפנה ללוגין
      logout: () => {
        console.log("Logout User Store");

        set({
          isLoggedIn: false,
          id: null,
          first_name: null,
          last_name: null,
          username: null,
          email: null,
          role: null,
        });
      },
    })),
    { name: "UserStore" } // שם שיופיע ב-Redux DevTools
  )
);

// {
//   name: "user-storage",
//   partialize: (state) => ({
//     // שומרים רק מה שצריך (לא את הפונקציות)
//     isLoggedIn: state.isLoggedIn,
//     id: state.id,
//     first_name: state.first_name,
//     last_name: state.last_name,
//     username: state.username,
//     email: state.email,
//     role: state.role,
//   }),
// }
