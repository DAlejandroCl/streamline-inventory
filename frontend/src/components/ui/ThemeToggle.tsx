import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme, type Theme } from "../../context/ThemeContext";

/* ============================================================
   THEME TOGGLE
   Segmented control de tres opciones: Light / System / Dark.
   El botón activo recibe background surface-lowest + shadow.
   Se puede usar en Navbar o en cualquier panel de settings.
   ============================================================ */

type Option = {
  value: Theme;
  icon: typeof Sun;
  label: string;
};

const OPTIONS: Option[] = [
  { value: "light",  icon: Sun,     label: "Light"  },
  { value: "system", icon: Monitor, label: "System" },
  { value: "dark",   icon: Moon,    label: "Dark"   },
];

type Props = {
  /* "icon" → solo muestra el ícono del modo activo (para Navbar)
     "full" → muestra los tres botones con label (para Settings) */
  variant?: "icon" | "full";
};

export default function ThemeToggle({ variant = "full" }: Props) {
  const { theme, setTheme } = useTheme();

  /* ── Compact icon-only toggle for Navbar ── */
  if (variant === "icon") {
    const active = OPTIONS.find((o) => o.value === theme) ?? OPTIONS[1];
    const Icon = active.icon;
    const next: Theme =
      theme === "light" ? "dark" : theme === "dark" ? "system" : "light";

    return (
      <button
        onClick={() => setTheme(next)}
        title={`Theme: ${theme} — click to switch`}
        className={[
          "p-2 rounded-xl transition-all duration-200 active:scale-95",
          "text-[var(--color-text-secondary)]",
          "hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-container)]",
          "dark:hover:bg-[var(--color-surface-high)]",
        ].join(" ")}
        aria-label={`Current theme: ${theme}`}
      >
        <Icon size={17} strokeWidth={2} />
      </button>
    );
  }

  /* ── Full segmented control ── */
  return (
    <div
      className={[
        "inline-flex p-1 rounded-xl gap-0.5",
        "bg-[var(--color-surface-low)] border border-[var(--color-border)]/50",
      ].join(" ")}
      role="radiogroup"
      aria-label="Theme selection"
    >
      {OPTIONS.map(({ value, icon: Icon, label }) => {
        const isActive = theme === value;
        return (
          <button
            key={value}
            role="radio"
            aria-checked={isActive}
            onClick={() => setTheme(value)}
            className={[
              "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold",
              "transition-all duration-200 select-none active:scale-95",
              isActive
                ? "bg-[var(--color-surface)] text-[var(--color-primary)] shadow-card"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]",
            ].join(" ")}
          >
            <Icon size={13} strokeWidth={isActive ? 2.5 : 2} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
