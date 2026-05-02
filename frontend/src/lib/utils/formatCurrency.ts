/* ============================================================
   FORMAT CURRENCY
   Usa Intl.NumberFormat para respetar la currency y locale
   seleccionados en SettingsContext.

   useCurrency() es el hook recomendado para componentes React.
   formatCurrency() es la función pura para uso fuera de React.
   ============================================================ */

import { useSettings } from "../../context/SettingsContext";

export const CURRENCY_LOCALES: Record<string, string> = {
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
  COP: "es-CO",
  MXN: "es-MX",
  ARS: "es-AR",
};

export const CURRENCY_LABELS: Record<string, string> = {
  USD: "US Dollar (USD)",
  EUR: "Euro (EUR)",
  GBP: "British Pound (GBP)",
  COP: "Colombian Peso (COP)",
  MXN: "Mexican Peso (MXN)",
  ARS: "Argentine Peso (ARS)",
};

export function formatCurrency(
  value: number,
  currency = "USD",
  locale?: string
): string {
  const resolvedLocale = locale ?? CURRENCY_LOCALES[currency] ?? "en-US";
  return new Intl.NumberFormat(resolvedLocale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/* ---- Hook — lee currency y locale del contexto ----------- */

export function useCurrency() {
  const { settings } = useSettings();
  const { currency } = settings;
  const locale = CURRENCY_LOCALES[currency] ?? "en-US";

  return {
    currency,
    locale,
    format: (value: number) => formatCurrency(value, currency, locale),
  };
}
