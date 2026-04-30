/* ============================================================
   NOTIFICATION BUS
   Puente entre los actions de React Router (que corren fuera
   del árbol de React y no pueden usar hooks) y el
   NotificationsContext (que vive dentro del árbol).

   Patrón: CustomEvent del DOM.
   - Actions disparan: dispatchNotification({ type, title, description })
   - NotificationsContext escucha el evento y llama a addNotification()

   Por qué CustomEvent y no un store externo (Zustand, etc.):
   - Zero dependencias externas
   - El DOM ya es un event bus global disponible en cualquier contexto
   - Completamente tipado
   - Se limpia solo cuando el componente desmonta
   ============================================================ */

import type { NotificationType } from "../context/NotificationsContext";

export const NOTIFICATION_EVENT = "streamline:notification" as const;

export type NotificationPayload = {
  type: NotificationType;
  title: string;
  description?: string;
};

export function dispatchNotification(payload: NotificationPayload): void {
  window.dispatchEvent(
    new CustomEvent(NOTIFICATION_EVENT, { detail: payload })
  );
}
