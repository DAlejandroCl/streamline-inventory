/* ============================================================
   NOTIFICATIONS CONTEXT
   Historial de notificaciones en memoria (se limpia al recargar).
   Cada notificación tiene: id, tipo, título, descripción, timestamp.

   useNotifications() expone:
   - notifications: lista ordenada por tiempo (más reciente primero)
   - unreadCount: número de no leídas (badge en campanita)
   - addNotification(n): agrega y muestra el toast de Sonner
   - markAllRead(): marca todas como leídas
   - clearAll(): vacía la lista

   addNotification se exporta también como función standalone
   notifySuccess/notifyError/notifyInfo para usar desde actions
   sin necesidad de tener el contexto disponible.
   ============================================================ */

import {
  createContext, useContext, useState, useCallback,
  type ReactNode,
} from "react";
import { toast } from "sonner";

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

      /* Also show a Sonner toast */
      const opts = { description: n.description };
      if (n.type === "success") toast.success(n.title, opts);
      else if (n.type === "error")   toast.error(n.title, opts);
      else if (n.type === "warning") toast.warning(n.title, opts);
      else                           toast.info(n.title, opts);
    },
    []
  );

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
