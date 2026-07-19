export interface ToastData {
  id: string;
  title: string;
  message: string;
  type: "success" | "danger" | "warning" | "info";
  duration?: number;
}

export const showToast = (
  title: string,
  message: string,
  type: "success" | "danger" | "warning" | "info" = "info",
  duration = 5000
) => {
  const event = new CustomEvent("guardianx-toast", {
    detail: { id: Math.random().toString(), title, message, type, duration },
  });
  window.dispatchEvent(event);
};
