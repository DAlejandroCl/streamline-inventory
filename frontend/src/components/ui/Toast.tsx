import { useEffect, useState } from "react";

type Variant = "success" | "error" | "info";

type Props = {
  message: string;
  variant?: Variant;
  duration?: number;
  onClose: () => void;
};

const styles: Record<Variant, { wrap: string; icon: string; iconName: string }> = {
  success: {
    wrap: "border-l-[var(--color-secondary)] bg-[var(--color-secondary-container)]/10",
    icon: "text-[var(--color-secondary)]",
    iconName: "check_circle",
  },
  error: {
    wrap: "border-l-[var(--color-error)] bg-[var(--color-error-container)]/20",
    icon: "text-[var(--color-error)]",
    iconName: "cancel",
  },
  info: {
    wrap: "border-l-[var(--color-primary)] bg-[var(--color-primary-fixed)]/20",
    icon: "text-[var(--color-primary)]",
    iconName: "info",
  },
};

export default function Toast({
  message,
  variant = "success",
  duration = 3500,
  onClose,
}: Props) {
  const [visible, setVisible] = useState(false);
  const s = styles[variant];

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 10);
    const t2 = setTimeout(() => setVisible(false), duration - 300);
    const t3 = setTimeout(onClose, duration);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [duration, onClose]);

  return (
    <div
      role="alert"
      aria-live="polite"
      className={[
        "fixed bottom-6 right-6 z-50",
        "flex items-center gap-3 px-4 py-3 min-w-72",
        "rounded-xl border-l-4 shadow-ambient",
        "glass-nav",
        s.wrap,
        "transition-all duration-300",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
      ].join(" ")}
    >
      <span className={`material-symbols-filled text-xl leading-none shrink-0 ${s.icon}`}>
        {s.iconName}
      </span>
      <p className="text-sm font-medium text-[var(--color-on-surface)] flex-1">{message}</p>
      <button
        onClick={() => { setVisible(false); setTimeout(onClose, 300); }}
        className="ml-1 text-[var(--color-outline)] hover:text-[var(--color-on-surface)] transition-colors"
        aria-label="Dismiss"
      >
        <span className="material-symbols-outlined text-lg leading-none">close</span>
      </button>
    </div>
  );
}
