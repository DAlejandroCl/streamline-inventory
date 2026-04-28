import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { router } from "./app/router";
import { ThemeProvider } from "./context/ThemeContext";
import { SettingsProvider } from "./context/SettingsContext";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <SettingsProvider>
        <RouterProvider router={router} />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3500,
            classNames: {
              toast:
                "!bg-[var(--color-surface)] !border !border-[var(--color-border)] !text-[var(--color-text-primary)] !shadow-lifted !rounded-2xl !font-sans !text-sm",
              title: "!font-semibold",
              description: "!text-[var(--color-text-muted)]",
              success: "!border-l-4 !border-l-[var(--color-secondary)]",
              error:   "!border-l-4 !border-l-[var(--color-error)]",
              warning: "!border-l-4 !border-l-[var(--color-warning)]",
            },
          }}
        />
      </SettingsProvider>
    </ThemeProvider>
  </StrictMode>,
);
