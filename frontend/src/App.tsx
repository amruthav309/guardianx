import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import LoadingScreen from "./pages/LoadingScreen";
import LogoutScreen from "./pages/LogoutScreen";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminForgotKey from "./pages/admin/AdminForgotKey";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUserDatabase from "./pages/admin/AdminUserDatabase";
import AdminLoginMonitoring from "./pages/admin/AdminLoginMonitoring";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminScanner from "./pages/admin/AdminScanner";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminHistory from "./pages/admin/AdminHistory";
import AdminLoadingScreen from "./pages/admin/AdminLoadingScreen";
import AdminLogoutScreen from "./pages/admin/AdminLogoutScreen";

import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import SwitchAccount from "./pages/SwitchAccount";
import Scanner from "./pages/Scanner";

import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>

      {/* Default Route */}
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      {/* Admin Portal Routes */}
      <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/forgot-key" element={<AdminForgotKey />} />
      <Route path="/admin/loading" element={<AdminLoadingScreen />} />
      <Route path="/admin/logout" element={<AdminLogoutScreen />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<AdminUserDatabase />} />
      <Route path="/admin/monitoring" element={<AdminLoginMonitoring />} />
      <Route path="/admin/profile" element={<AdminProfile />} />
      <Route path="/admin/scanner" element={<AdminScanner />} />
      <Route path="/admin/analytics" element={<AdminAnalytics />} />
      <Route path="/admin/history" element={<AdminHistory />} />

      {/* Authentication */}
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/verify-email"
        element={<VerifyEmail />}
      />

      <Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>

      {/* Loading Screen */}
      <Route
        path="/loading"
        element={<LoadingScreen />}
      />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
  path="/scanner"
  element={<Scanner />}
/>

      {/* Analytics */}
      <Route
        path="/analytics"
        element={<Analytics />}
      />

      {/* History */}
      <Route
        path="/history"
        element={<History />}
      />

      {/* Profile */}
      <Route
        path="/profile"
        element={<Profile />}
      />

      {/* Settings */}
      <Route
        path="/settings"
        element={<Settings />}
      />

      <Route
        path="/switch-account"
        element={<SwitchAccount />}
      />

      {/* 404 */}
      <Route
        path="*"
        element={<NotFound />}
      />

      <Route
        path="/logout"
        element={<LogoutScreen />}
      />

    </Routes>
  );
}

export default App;