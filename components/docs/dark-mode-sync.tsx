"use client";

import { useColorScheme } from "@mui/material/styles";
import { useEffect } from "react";

function applyDarkClass(isDark: boolean) {
  const root = document.documentElement;
  if (isDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

/**
 * Syncs the `.dark` class on <html> with MUI's color scheme.
 * Fumadocs uses `.dark` for its dark-mode CSS variables;
 * MUI uses `data-mui-color-scheme`. This bridges the two.
 */
export function DarkModeSync() {
  const { mode, systemMode } = useColorScheme();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    function update() {
      let effective: string;
      if (mode === "system" || mode == null) {
        effective = systemMode ?? (mq.matches ? "dark" : "light");
      } else {
        effective = mode;
      }
      applyDarkClass(effective === "dark");
    }

    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [mode, systemMode]);

  return null;
}
