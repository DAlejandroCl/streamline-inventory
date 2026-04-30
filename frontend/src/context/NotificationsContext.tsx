/* ============================================================
   NOTIFICATIONS CONTEXT
   Historial de notificaciones en memoria de la sesión actual.

   INTEGRACIÓN CON ACTIONS:
   Los actions de React Router corren fuera del árbol React y no
   pueden usar hooks. El puente es el notificationBus:
     action → dispatchNotification() → CustomEvent del DOM
                                              ↓
                              useEffect aquí escucha el evento
                                              ↓
                              addNotification() → estado + toast

   ESTRUCTURA DE NOTIFICACIÓN:
   - type:        "success" | "error" | "warning" | "info"
   - title:       texto principal (aparece en toast y dropdown)
   - description: detalle adicional (solo en dropdown)
   - timestamp:   para el "hace X minutos"
   - read:        para el badge de no leídas

   LÍMITE: 20 notificaciones máximo (FIFO — las más antiguas salen)
   ============================================================ */

import {
  createContext, useContext, useState, useCallback,
  useEffect, type ReactNode,
} from "react";
import { toast } from "sonner";
import {
  NOTIFICATION_EVENT,
  type NotificationPayload,
} from "../lib/notificationBus";

export type NotificationType = "success" | "error" | "warning" | "info";

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  description?: string;
  timestamp: Date;
  read: boolean;
};

type NotificationsContextValue = {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markAllRead: () => void;
  clearAll: () => void;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

const MAX_NOTIFICATIONS = 20;

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (n: Omit<Notification, "id" | "timestamp" | "read">) => {
      const notification: Notification = {
        ...n,
        id: crypto.randomUUID(),
        timestamp: new Date(),
        read: false,
      };

      setNotifications((prev) =>
        [notification, ...prev].slice(0, MAX_NOTIFICATIONS)
      );

      /* Mostrar toast de Sonner simultáneamente */
      const opts = { description: n.description };
      if (n.type === "success") toast.success(n.title, opts);
      else if (n.type === "error")   toast.error(n.title, opts);
      else if (n.type === "warning") toast.warning(n.title, opts);
      else                           toast.info(n.title, opts);
    },
    []
  );

  /*
   * Escuchar eventos del notificationBus.
   * Los actions de React Router disparan CustomEvents que
   * este useEffect captura y convierte en notificaciones.
   */
  useEffect(() => {
    function handleBusEvent(e: Event) {
      const payload = (e as CustomEvent<NotificationPayload>).detail;
      addNotification(payload);
    }

    window.addEventListener(NOTIFICATION_EVENT, handleBusEvent);
    return () => window.removeEventListener(NOTIFICATION_EVENT, handleBusEvent);
  }, [addNotification]);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => setNotifications([]), []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadCount, addNotification, markAllRead, clearAll }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications(): NotificationsContextValue {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be inside <NotificationsProvider>");
  return ctx;
}
