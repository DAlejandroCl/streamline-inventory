import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

/* ============================================================
   THEME CONTEXT
   Soporta tres modos:
   - light   → fuerza tema claro siempre
   - dark    → fuerza tema oscuro siempre
   - system  → sigue prefers-color-scheme del SO en tiempo real

   La clase `.dark` se aplica directamente sobre <html> para
   que los tokens CSS del design system (definidos en index.css)
   se activen automáticamente sin pasar props a cada componente.
   ============================================================ */

export type Theme = "light" | "dark" | "system";

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "streamline-theme";

/* ---- Helpers ---------------------------------------------- */

function getStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    /* localStorage not available */
  }
  return "system";
}

function getSystemPreference(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(resolved: "light" | "dark") {
  if (resolved === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

/* ---- Provider --------------------------------------------- */

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme);
  const [systemPref, setSystemPref] = useState<"light" | "dark">(getSystemPreference);

  const resolvedTheme: "light" | "dark" =
    theme === "system" ? systemPref : theme;

  /* Apply .dark class whenever resolvedTheme changes */
  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  /* Track OS preference changes — only relevant when theme === "system" */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) =>
      setSystemPref(e.matches ? "dark" : "light");

    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/* ---- Hook ------------------------------------------------- */

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
