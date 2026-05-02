/* ============================================================
   FORMAT DATE
   Respeta dateFormat y timeFormat del SettingsContext.
   useDate() es el hook para componentes React.
   formatDate() es la función pura para uso sin contexto.
   ============================================================ */

import { useSettings } from "../../context/SettingsContext";
import type { DateFormat, TimeFormat } from "../../context/SettingsContext";

export function formatDate(
  dateStr: string | Date | undefined,
  format: DateFormat = "MM/DD/YYYY"
): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "—";

  const day   = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year  = date.getFullYear();

  switch (format) {
    case "DD/MM/YYYY": return `${day}/${month}/${year}`;
    case "YYYY-MM-DD": return `${year}-${month}-${day}`;
    case "MM/DD/YYYY":
    default:            return `${month}/${day}/${year}`;
  }
}

export function formatDateLocale(
  dateStr: string | Date | undefined,
  format: DateFormat = "MM/DD/YYYY"
): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "—";

  const localeMap: Record<DateFormat, Intl.DateTimeFormatOptions & { locale: string }> = {
    "MM/DD/YYYY": { locale: "en-US",  month: "short", day: "numeric", year: "numeric" },
    "DD/MM/YYYY": { locale: "en-GB",  month: "short", day: "numeric", year: "numeric" },
    "YYYY-MM-DD": { locale: "sv-SE",  year: "numeric", month: "2-digit", day: "2-digit" },
  };

  const { locale, ...opts } = localeMap[format];
  return date.toLocaleDateString(locale, opts);
}

/* ---- Hook ------------------------------------------------- */

export function useDate() {
  const { settings } = useSettings();
  const { dateFormat, timeFormat } = settings;

  return {
    dateFormat,
    timeFormat,
    format: (d: string | Date | undefined) => formatDateLocale(d, dateFormat),
    formatTime: (d: string | Date | undefined) => {
      if (!d) return "—";
      const date = new Date(d);
      if (isNaN(date.getTime())) return "—";
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: timeFormat === "12h",
      });
    },
  };
}
