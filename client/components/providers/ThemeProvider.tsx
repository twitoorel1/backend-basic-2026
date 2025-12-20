"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { Toaster } from "sonner";
import { UserSync } from "../auth/UserSync";
import { SessionProvider } from "next-auth/react";

export const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  return (
    <SessionProvider>
      <NextThemesProvider attribute={"class"} defaultTheme="system" enableSystem disableTransitionOnChange {...props}>
        <UserSync />
        {children}
        <Toaster richColors closeButton position="top-center" toastOptions={{ style: { fontFamily: "Rubik, sans-serif" } }} />
      </NextThemesProvider>
    </SessionProvider>
  );
};

// export default ThemeProvider;
