import { createContext, useContext, useState, useCallback } from "react";

export type Currency = "USD" | "EUR" | "COP" | "GBP" | "MXN" | "ARS";
export type Language = "en" | "es";
export type DateFormat = "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD";
export type TimeFormat = "12h" | "24h";

export type NotificationSettings = {
  lowStockAlert: boolean;
  lowStockThreshold: number;
  outOfStockAlert: boolean;
  newProductAlert: boolean;
  emailNotifications: boolean;
  browserNotifications: boolean;
};

export type DisplaySettings = {
  itemsPerPage: number;
  defaultView: "table" | "grid";
  showCostPrice: boolean;
  showStockWarnings: boolean;
  compactMode: boolean;
};

export type Settings = {
  /* Profile */
  companyName: string;
  adminName: string;
  adminEmail: string;
  adminRole: string;
  timezone: string;
  /* Regional */
  currency: Currency;
  language: Language;
  dateFormat: DateFormat;
  timeFormat: TimeFormat;
  /* Display */
  display: DisplaySettings;
  /* Notifications */
  notifications: NotificationSettings;
};

type SettingsContextValue = {
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
  updateDisplay: (patch: Partial<DisplaySettings>) => void;
  updateNotifications: (patch: Partial<NotificationSettings>) => void;
  resetSettings: () => void;
};

const STORAGE_KEY = "streamline-settings-v2";

export const DEFAULT_SETTINGS: Settings = {
  companyName: "Streamline",
  adminName: "Admin User",
  adminEmail: "admin@streamline.app",
  adminRole: "Administrator",
  timezone: "America/Bogota",
  currency: "USD",
  language: "en",
  dateFormat: "MM/DD/YYYY",
  timeFormat: "12h",
  display: {
    itemsPerPage: 10,
    defaultView: "table",
    showCostPrice: false,
    showStockWarnings: true,
    compactMode: false,
  },
  notifications: {
    lowStockAlert: true,
    lowStockThreshold: 5,
    outOfStockAlert: true,
    newProductAlert: false,
    emailNotifications: false,
    browserNotifications: true,
  },
};

function load(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        display: { ...DEFAULT_SETTINGS.display, ...parsed.display },
        notifications: { ...DEFAULT_SETTINGS.notifications, ...parsed.notifications },
      };
    }
  } catch { /* ignore */ }
  return DEFAULT_SETTINGS;
}

function save(s: Settings) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch { /* ignore */ }
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(load);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      save(next);
      return next;
    });
  }, []);

  const updateDisplay = useCallback((patch: Partial<DisplaySettings>) => {
    setSettings((prev) => {
      const next = { ...prev, display: { ...prev.display, ...patch } };
      save(next);
      return next;
    });
  }, []);

  const updateNotifications = useCallback((patch: Partial<NotificationSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, notifications: { ...prev.notifications, ...patch } };
      save(next);
      return next;
    });
  }, []);

  const resetSettings = useCallback(() => {
    save(DEFAULT_SETTINGS);
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, updateDisplay, updateNotifications, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside <SettingsProvider>");
  return ctx;
}
