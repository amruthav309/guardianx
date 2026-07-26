export const APP_NAME = "GuardianX";

export const APP_DESCRIPTION =
  "AI Digital Safety Platform";

export const getApiBaseUrl = (): string => {
  let url = import.meta.env.VITE_API_URL;

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    const isLocal = host === "localhost" || host === "127.0.0.1";
    if (!isLocal && (!url || url.includes("localhost") || url.includes("127.0.0.1"))) {
      url = window.location.origin;
    } else if (isLocal && (!url || url.includes("localhost") || url.includes("127.0.0.1"))) {
      url = `http://${host}:8000`;
    }
  }

  if (!url) {
    url = "http://127.0.0.1:8000";
  }

  url = url.trim().replace(/\/+$/, "");
  if (url.endsWith("/api")) {
    url = url.slice(0, -4);
  }
  return url;
};

export const API_BASE_URL = getApiBaseUrl();
