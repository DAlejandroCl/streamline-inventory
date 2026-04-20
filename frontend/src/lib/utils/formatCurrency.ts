/*
 * Formateador de precios centralizado.
 * Usar este helper en lugar de inline toLocaleString()
 * para garantizar consistencia en toda la aplicación.
 *
 * formatCurrency(1499)    → "$1,499.00"
 * formatCurrency(49.9)    → "$49.90"
 * formatCurrency(0)       → "$0.00"
 */

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
