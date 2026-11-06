import { useEffect, useState, type ReactNode } from "react";
import { StorageService } from "../services/StorageService";
import { STORAGE_KEYS } from "../services/storageKeys";
import { ThemeContext, type Theme } from "./theme-context";

const isTheme = (value: unknown): value is Theme => value === "light" || value === "dark";
const themeStorage = new StorageService<Theme>(STORAGE_KEYS.theme, isTheme, "light");

function initialTheme(): Theme {
  if (localStorage.getItem(STORAGE_KEYS.theme) !== null) return themeStorage.load();
  // Start new visitors in the storefront's light theme. Dark mode is opt-in
  // through the theme toggle and remains available on later visits.
  return "light";
}

/** One theme for the whole app: the Header and Profile switches both use this context. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      themeStorage.save(next);
      return next;
    });
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}
