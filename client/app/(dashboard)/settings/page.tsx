"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const DashboardSettings = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      Dashboard Settings Page
      <br />
      <Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>החלף {theme === "dark" ? "ליום" : "לילה"}</Button>
    </div>
  );
};

export default DashboardSettings;
