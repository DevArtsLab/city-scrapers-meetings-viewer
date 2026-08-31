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
 * Client-side companion to DocsDarkModeSyncScript.
 *
 * Both components exist because Fumadocs and MUI use different dark-mode
 * mechanisms that need bridging:
 * - Fumadocs applies a `.dark` CSS class on <html> for its CSS variables.
 * - MUI uses `data-mui-color-scheme` on <html> for its color scheme.
 *
 * DocsDarkModeSyncScript runs before hydration to prevent a flash of
 * wrong theme. This component runs after hydration to keep the `.dark`
 * class in sync when the user toggles color scheme at runtime.
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
