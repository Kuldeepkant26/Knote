// Theme management: light | dark | system (null). The stored preference
// lives in localStorage; "system" follows the OS via matchMedia. The .dark
// class on <html> is the single switch the CSS token flip keys off.
// index.html has a tiny inline script that applies .dark before the app
// bundle loads (FOUC guard) using the same storage key and logic.

const STORAGE_KEY = "knote-theme";
const media = window.matchMedia("(prefers-color-scheme: dark)");

const listeners = new Set();

export function getStoredTheme() {
  const value = localStorage.getItem(STORAGE_KEY);
  return value === "light" || value === "dark" ? value : null; // null = system
}

export function isDarkActive() {
  return document.documentElement.classList.contains("dark");
}

function applyTheme(pref) {
  const dark = pref ? pref === "dark" : media.matches;
  document.documentElement.classList.toggle("dark", dark);
  listeners.forEach((fn) => fn());
}

export function setTheme(pref) {
  if (pref === "light" || pref === "dark") {
    localStorage.setItem(STORAGE_KEY, pref);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
  applyTheme(pref);
}

export function initTheme() {
  applyTheme(getStoredTheme());
  media.addEventListener("change", () => {
    if (!getStoredTheme()) applyTheme(null); // only system mode tracks the OS
  });
}

function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// React hook: returns { theme: "light"|"dark"|null, isDark, cycle }.
// cycle steps light -> dark -> system -> light.
import { useSyncExternalStore, useCallback } from "react";

export function useTheme() {
  const isDark = useSyncExternalStore(subscribe, isDarkActive);
  const theme = useSyncExternalStore(subscribe, getStoredTheme);

  const cycle = useCallback(() => {
    const next = theme === "light" ? "dark" : theme === "dark" ? null : "light";
    setTheme(next);
  }, [theme]);

  return { theme, isDark, cycle };
}
