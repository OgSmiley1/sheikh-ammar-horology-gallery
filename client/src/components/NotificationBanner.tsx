import { X, AlertCircle, CheckCircle, Info } from "lucide-react";
import { useEffect, useState } from "react";

export type NotificationType = "success" | "error" | "info" | "warning";

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

// Global notification store
let notificationId = 0;
let listeners: ((notifications: Notification[]) => void)[] = [];
let notifications: Notification[] = [];

export function useNotification() {
  const [notifs, setNotifs] = useState<Notification[]>(notifications);

  useEffect(() => {
    const listener = (newNotifs: Notification[]) => {
      setNotifs(newNotifs);
    };
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  const notify = (message: string, type: NotificationType = "info", duration = 4000) => {
    const id = String(notificationId++);
    const notification: Notification = { id, message, type, duration };
    notifications = [...notifications, notification];
    listeners.forEach((l) => l(notifications));

    if (duration > 0) {
      setTimeout(() => {
        notifications = notifications.filter((n) => n.id !== id);
        listeners.forEach((l) => l(notifications));
      }, duration);
    }

    return id;
  };

  return { notify };
}

export function NotificationContainer() {
  const [notifs, setNotifs] = useState<Notification[]>(notifications);

  useEffect(() => {
    const listener = (newNotifs: Notification[]) => {
      setNotifs(newNotifs);
    };
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  const removeNotification = (id: string) => {
    notifications = notifications.filter((n) => n.id !== id);
    listeners.forEach((l) => l(notifications));
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none">
      <div className="container mx-auto px-4 pt-4 space-y-2">
        {notifs.map((notif) => (
          <div
            key={notif.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg backdrop-blur-xl border pointer-events-auto animate-in slide-in-from-top-2 ${
              notif.type === "success"
                ? "status-success-surface status-success-text"
                : notif.type === "error"
                ? "status-danger-surface status-danger-text"
                : notif.type === "warning"
                ? "status-warning-surface status-warning-text"
                : "status-info-surface status-info-text"
            }`}
          >
            {notif.type === "success" && <CheckCircle className="h-5 w-5 flex-shrink-0" />}
            {notif.type === "error" && <AlertCircle className="h-5 w-5 flex-shrink-0" />}
            {notif.type === "warning" && <AlertCircle className="h-5 w-5 flex-shrink-0" />}
            {notif.type === "info" && <Info className="h-5 w-5 flex-shrink-0" />}
            <span className="flex-1">{notif.message}</span>
            <button
              onClick={() => removeNotification(notif.id)}
              className="rounded p-1 transition-colors hover:bg-foreground/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
