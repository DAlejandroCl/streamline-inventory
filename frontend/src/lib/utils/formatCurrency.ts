/* ============================================================
   FORMAT CURRENCY
   Usa Intl.NumberFormat para formatear precios de forma
   consistente. La currency puede pasarse explícitamente
   o leerse del SettingsContext a través del hook useCurrency.
   ============================================================ */

export function formatCurrency(
  value: number,
  currency = "USD",
  locale = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/* ---- Currency locale map ---------------------------------- */

export const CURRENCY_LOCALES: Record<string, string> = {
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
  COP: "es-CO",
};

export const CURRENCY_LABELS: Record<string, string> = {
  USD: "US Dollar (USD)",
  EUR: "Euro (EUR)",
  GBP: "British Pound (GBP)",
  COP: "Colombian Peso (COP)",
};
