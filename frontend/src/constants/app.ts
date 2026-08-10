export const APP_NAME = "GuardianX";

export const APP_DESCRIPTION =
  "AI Digital Safety Platform";

export const getApiBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;

    const isLocal =
      host === "localhost" ||
      host === "127.0.0.1";

    // Local development
    if (isLocal) {
      return `http://${host}:8000`;
    }

    // Production - Render FastAPI backend
    return "https://guardianx-backend-9ymd.onrender.com";
  }

  // Fallback for non-browser environments
  return "https://guardianx-backend-9ymd.onrender.com";
};

export const API_BASE_URL = getApiBaseUrl();