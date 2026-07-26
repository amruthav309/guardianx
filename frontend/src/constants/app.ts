export const APP_NAME = "GuardianX";

export const APP_DESCRIPTION =
  "AI Digital Safety Platform";

export const getApiBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    const isLocal = host === "localhost" || host === "127.0.0.1";
    if (!isLocal) {
      return window.location.origin;
    }
    return `http://${host}:8000`;
  }
  return "http://127.0.0.1:8000";
};

export const API_BASE_URL = getApiBaseUrl();
