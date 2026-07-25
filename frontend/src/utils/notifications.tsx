import { showToast } from "./showToast";

export const addNotification = (
  title: string,
  message: string,
  type: "success" | "danger" | "warning" | "info"
) => {

  const notifications = JSON.parse(
    localStorage.getItem("guardianx_notifications") || "[]"
  );

  notifications.unshift({
    id: Date.now(),
    title,
    message,
    type,
    time: new Date().toLocaleTimeString(),
    read: false,
  });

  localStorage.setItem(
    "guardianx_notifications",
    JSON.stringify(notifications)
  );

  // Trigger custom toast notification
  showToast(title, message, type);

  // Dispatch custom window event to trigger instant Topbar sync
  window.dispatchEvent(new Event("guardianx_notification_added"));

};