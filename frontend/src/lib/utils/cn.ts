/*
 * Helper para componer clases de Tailwind de forma condicional.
 * Alternativa ligera a clsx/classnames sin dependencias externas.
 *
 * cn("px-4", isActive && "bg-indigo-600", undefined)
 * → "px-4 bg-indigo-600"
 */

export function cn(
  ...classes: (string | boolean | undefined | null)[]
): string {
  return classes.filter(Boolean).join(" ");
}
