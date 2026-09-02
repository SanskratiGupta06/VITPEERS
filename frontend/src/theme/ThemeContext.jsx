import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { DEFAULT_THEME, THEME_ORDER } from "./themes.js";
import api from "../api.js";

const ThemeContext = createContext(null);
const STORAGE_KEY = "vitpeers_world";

function isValidTheme(t) {
  return THEME_ORDER.includes(t);
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    const cached = localStorage.getItem(STORAGE_KEY);
    return isValidTheme(cached) ? cached : DEFAULT_THEME;
  });

  // Apply immediately (and on every change) — this is what the CSS
  // [data-theme="..."] selectors in index.css hook into.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // On boot, if logged in, reconcile with the backend's saved preference
  // (e.g. the user switched worlds on another device).
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return;
    api
      .get("/users/me")
      .then(({ data }) => {
        if (data?.themePreference && isValidTheme(data.themePreference)) {
          setThemeState(data.themePreference);
          localStorage.setItem(STORAGE_KEY, data.themePreference);
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTheme = useCallback((next) => {
    if (!isValidTheme(next)) return;
    setThemeState(next);
    localStorage.setItem(STORAGE_KEY, next);

    const token = sessionStorage.getItem("token");
    if (token) {
      api.put("/users/me", { themePreference: next }).catch(() => {
        // Non-critical — the choice still applies locally via localStorage.
      });
    }
  }, []);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
