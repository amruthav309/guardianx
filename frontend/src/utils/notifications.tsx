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

};