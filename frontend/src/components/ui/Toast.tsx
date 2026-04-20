import { useEffect, useState } from "react";

type ToastVariant = "success" | "error" | "info";

type Props = {
  message: string;
  variant?: ToastVariant;
  duration?: number;
  onClose: () => void;
};

const styles: Record<ToastVariant, string> = {
  success: "bg-green-50 border-green-300 text-green-800",
  error: "bg-red-50 border-red-300 text-red-800",
  info: "bg-indigo-50 border-indigo-300 text-indigo-800",
};

const icons: Record<ToastVariant, string> = {
  success: "✓",
  error: "✕",
  info: "i",
};

export default function Toast({
  message,
  variant = "success",
  duration = 3500,
  onClose,
}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    /* Trigger enter animation on mount */
    const enterTimer = setTimeout(() => setVisible(true), 10);

    /* Start exit animation before calling onClose */
    const exitTimer = setTimeout(() => setVisible(false), duration - 300);

    /* Remove from DOM after exit animation */
    const removeTimer = setTimeout(onClose, duration);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, [duration, onClose]);

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        fixed bottom-6 right-6 z-50 flex items-center gap-3
        px-4 py-3 rounded-xl border shadow-md text-sm font-medium
        transition-all duration-300
        ${styles[variant]}
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
      `}
    >
      <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border border-current">
        {icons[variant]}
      </span>
      {message}
      <button
        onClick={() => { setVisible(false); setTimeout(onClose, 300); }}
        className="ml-2 opacity-60 hover:opacity-100 transition-opacity text-base leading-none"
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );
}
