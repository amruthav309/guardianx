import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import ToastContainer from "./components/ToastContainer";
import "./styles/global.css";
import "./styles/responsive.css";

import { ThemeProvider } from "./context/ThemeContext";
import { showToast } from "./utils/showToast";

// Intercept native browser alert to show beautiful custom cyberpunk toasts
window.alert = (message: string) => {
  let type: "info" | "success" | "danger" | "warning" = "info";
  let title = "System Notification";

  const lower = message.toLowerCase();
  
  if (lower.includes("status: phishing") || lower.includes("phishing email")) {
    type = "danger";
    title = "SECURITY THREAT DETECTED";
  } else if (lower.includes("status: suspicious") || lower.includes("suspicious")) {
    type = "warning";
    title = "SUSPICIOUS ACTIVITY ALERT";
  } else if (lower.includes("status: safe") || lower.includes("safe")) {
    type = "success";
    title = "CLEARED: SAFE SECURE";
  } else if (
    lower.includes("success") ||
    lower.includes("verified") ||
    lower.includes("clear") ||
    lower.includes("done") ||
    lower.includes("correct") ||
    lower.includes("save") ||
    lower.includes("updated")
  ) {
    type = "success";
    title = "System Restored / Access Granted";
  } else if (
    lower.includes("error") ||
    lower.includes("fail") ||
    lower.includes("unable") ||
    lower.includes("not found") ||
    lower.includes("invalid")
  ) {
    type = "danger";
    title = "Threat / System Failure";
  } else if (
    lower.includes("warning") ||
    lower.includes("match") ||
    lower.includes("please fill") ||
    lower.includes("first") ||
    lower.includes("paste text")
  ) {
    type = "warning";
    title = "Authorization Warning";
  }

  showToast(title, message, type);
};

ReactDOM.createRoot(
  document.getElementById("root")!
).render(

  <React.StrictMode>

    <BrowserRouter>

      <ThemeProvider>

        <App />
        <ToastContainer />

      </ThemeProvider>

    </BrowserRouter>

  </React.StrictMode>

);