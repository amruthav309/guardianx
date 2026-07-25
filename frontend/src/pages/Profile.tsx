import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  changePassword,
  getCurrentUser,
  updateProfile,
  uploadAvatar,
} from "../services/auth";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaShieldAlt,
  FaCalendarAlt,
  FaUserEdit,
  FaUpload,
  FaRobot,
  FaHome,
} from "react-icons/fa";

// Expanded set of animated cyber-themed avatars
const PREDEFINED_AVATARS = [
  { id: "sentinel",  name: "Sentinel AI",   url: "https://api.dicebear.com/7.x/bottts/svg?seed=sentinel&backgroundColor=0a0a0f" },
  { id: "cyber",     name: "H4ck3r Elite",  url: "https://api.dicebear.com/7.x/bottts/svg?seed=cyber&backgroundColor=0a0a0f" },
  { id: "guardian",  name: "Guardian Bot",  url: "https://api.dicebear.com/7.x/bottts/svg?seed=guardian&backgroundColor=0a0a0f" },
  { id: "agent",     name: "Cyber Ops",     url: "https://api.dicebear.com/7.x/bottts/svg?seed=agent&backgroundColor=0a0a0f" },
  { id: "phantom",   name: "Phantom",       url: "https://api.dicebear.com/7.x/bottts/svg?seed=phantom&backgroundColor=0a0a0f" },
  { id: "nexus",     name: "Nexus Core",    url: "https://api.dicebear.com/7.x/bottts/svg?seed=nexus&backgroundColor=0a0a0f" },
  { id: "matrix",    name: "Matrix-X",      url: "https://api.dicebear.com/7.x/bottts/svg?seed=matrix&backgroundColor=0a0a0f" },
  { id: "stealth",   name: "Stealth Unit",  url: "https://api.dicebear.com/7.x/bottts/svg?seed=stealth&backgroundColor=0a0a0f" },
];

function Profile() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    return localStorage.getItem("sidebarOpen") !== "false";
  });

  useEffect(() => {
    localStorage.setItem("sidebarOpen", String(sidebarOpen));
  }, [sidebarOpen]);

  const [editing, setEditing] = useState(false);
  const [passwordPopup, setPasswordPopup] = useState(false);

  useEffect(() => {
    if (location.state?.openPassword) {
      setPasswordPopup(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const [name, setName] = useState(user.name || "");
  const [username, setUsername] = useState(user.username || "");
  const [selectedAvatar, setSelectedAvatar] = useState(user.profile_pic || "");

  // File upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");

  const hasMinLength = newPassword.length >= 8;
  const hasCapital = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const isPasswordValid = hasMinLength && hasCapital && hasLowercase && hasNumber && hasSpecial;

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
    setSelectedAvatar(""); // deselect predefined avatar
    const reader = new FileReader();
    reader.onload = (e) => setUploadPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleFileSelect(file);
  };

  const handlePasswordChange = async () => {
    setPwdError("");
    setPwdSuccess("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwdError("Please fill all fields.");
      return;
    }
    if (!isPasswordValid) {
      setPwdError("Password does not meet the complexity requirements.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError("Passwords do not match.");
      return;
    }
    try {
      setLoading(true);
      const res = await changePassword({
        email: user.email,
        current_password: currentPassword,
        new_password: newPassword,
      });
      setPwdSuccess(res.message || "Password updated successfully.");
      setTimeout(() => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPwdSuccess("");
        setPwdError("");
        setPasswordPopup(false);
      }, 2000);
    } catch (error: any) {
      setPwdError(
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Unable to change password."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      let avatarToSave = selectedAvatar;

      if (uploadedFile) {
        setUploading(true);
        const res = await uploadAvatar(user.id, uploadedFile);
        avatarToSave = res.avatar_url;
        setUploading(false);
      }

      const res = await updateProfile(user.id, {
        name,
        username,
        profile_pic: avatarToSave,
      });

      const updatedUser = { ...user, name, username, profile_pic: avatarToSave };
      localStorage.setItem("guardianx_user", JSON.stringify(updatedUser));

      const accounts = JSON.parse(localStorage.getItem("guardianx_accounts") || "[]");
      const updatedAccounts = accounts.map((acc: any) => {
        if (acc.email === user.email) return { ...acc, name, username, profile_pic: avatarToSave };
        return acc;
      });
      localStorage.setItem("guardianx_accounts", JSON.stringify(updatedAccounts));

      alert(res.message || "Profile updated successfully.");
      setEditing(false);
      window.location.reload();
    } catch (error: any) {
      setUploading(false);
      alert(
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Unable to update profile."
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#080e18] text-white page-enter">
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed lg:static top-0 left-0 h-screen z-50 flex-shrink-0">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      <div className="flex-1 p-3 sm:p-6 overflow-y-auto min-w-0">
        <Topbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#111927]/90 border border-sky-500/20 rounded-2xl p-5 shadow-xl">
          <div>
            <h1 className="text-3xl font-bold font-serif-header text-sky-400 glow-text-cyan">
              User Security Profile
            </h1>
            <p className="text-sky-400/60 text-xs mt-1">
              Manage your GuardianX authorization identity credentials.
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#111927] border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 text-xs font-cyber transition-all cursor-pointer font-semibold shadow-md"
          >
            <FaHome size={12} /> Dashboard
          </button>
        </div>

        {/* User Card */}
        <div className="mt-6 glass-panel-cyan rounded-2xl p-8 border border-sky-500/25 relative overflow-hidden shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
            {user.profile_pic ? (
              <img
                src={user.profile_pic}
                alt={user.name}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-sky-500/40 glow-cyan bg-[#080e18]"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <FaUserCircle size={60} />
              </div>
            )}

            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold font-serif-header text-slate-100">
                {user.name || "User"}
              </h2>
              <p className="text-xs text-sky-400 font-mono mt-1 uppercase tracking-widest glow-text-cyan">
                User: @{user.username || "anonymous"}
              </p>
              <button
                onClick={() => setEditing(true)}
                className="mt-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white px-5 py-2 rounded-xl text-xs font-bold font-cyber flex items-center justify-center gap-2 glow-cyan transition-all cursor-pointer mx-auto sm:mx-0 shadow-lg shadow-sky-500/25"
              >
                <FaUserEdit size={14} />
                Edit Identity Details
              </button>
            </div>
          </div>
        </div>

        {/* Metadata info cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-[#111927]/90 border border-sky-500/20 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs text-sky-400/60 uppercase font-cyber">Identity Email</span>
              <FaEnvelope className="text-sky-400 text-sm" />
            </div>
            <p className="text-sm font-mono font-semibold text-slate-200 mt-4 break-all">
              {user.email || "N/A"}
            </p>
          </div>

          <div className="bg-[#111927]/90 border border-sky-500/20 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs text-sky-400/60 uppercase font-cyber">Secure Phone</span>
              <FaPhone className="text-sky-400/50 text-sm" />
            </div>
            <p className="text-sm font-semibold text-sky-400/60 mt-4">
              None Configured
            </p>
          </div>

          <div className="bg-[#111927]/90 border border-sky-500/20 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs text-sky-400/60 uppercase font-cyber">Security Status</span>
              <FaShieldAlt className="text-sky-400 text-sm" />
            </div>
            <p className="text-sm font-semibold text-sky-400 font-cyber mt-4 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-ping" />
              {user.account_status || "Active"}
            </p>
          </div>

          <div className="bg-[#111927]/90 border border-sky-500/20 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs text-sky-400/60 uppercase font-cyber">Last Clearance</span>
              <FaCalendarAlt className="text-amber-400 text-sm" />
            </div>
            <p className="text-xs font-mono font-semibold text-slate-300 mt-4">
              {user.last_login ? new Date(user.last_login).toLocaleString() : "Initial Login"}
            </p>
          </div>
        </div>

        {/* Security Controls */}
        <div className="mt-8 border-t border-sky-500/15 pt-6">
          <h2 className="text-lg font-bold font-serif-header text-sky-400 glow-text-cyan mb-4">
            Identity Security Controls
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#111927]/90 border border-sky-500/20 rounded-2xl p-5 shadow-xl">
              <h3 className="font-cyber text-sm font-bold text-slate-200">Session Statistics</h3>
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-sky-500/10">
                  <span className="text-sky-400/60 font-cyber">Authentication Count</span>
                  <span className="font-mono text-slate-200">{user.login_count || 0}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-sky-500/10">
                  <span className="text-sky-400/60 font-cyber">Application Version</span>
                  <span className="font-mono text-slate-200">v2.0 (Premium)</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-sky-400/60 font-cyber">Segregated Database</span>
                  <span className="text-sky-400 font-cyber">Isolated ✓</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setPasswordPopup(true)}
              className="bg-[#111927]/90 hover:bg-[#131f33] border border-sky-500/20 hover:border-sky-500/40 rounded-2xl p-5 text-left transition-all flex items-center justify-between group cursor-pointer shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center border border-sky-500/20 text-sky-400">
                  <FaShieldAlt size={18} />
                </div>
                <div>
                  <h4 className="font-cyber text-sm font-bold text-slate-200">Credentials Key</h4>
                  <p className="text-sky-400/60 text-xs mt-1 font-sans">Change password for secure terminal entry</p>
                </div>
              </div>
              <span className="text-2xl text-sky-400/40 group-hover:text-sky-400 transition-colors">›</span>
            </button>
          </div>
        </div>
      </div>

      {/* ===== Edit Profile Modal ===== */}
      {editing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className="bg-[#111927] p-6 rounded-2xl w-full max-w-[520px] border border-sky-500/30 shadow-2xl relative overflow-y-auto"
            style={{ maxHeight: "90vh" }}
          >
            <h2 className="text-xl font-bold font-serif-header text-sky-400 mb-6 glow-text-cyan">
              Modify Identity Details
            </h2>

            <div className="space-y-5">
              <div>
                <label className="text-xs text-sky-400/60 block mb-1 uppercase font-cyber">Full Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#080e18] border border-sky-500/20 text-sm outline-none focus:border-sky-400 text-white font-sans"
                />
              </div>

              <div>
                <label className="text-xs text-sky-400/60 block mb-1 uppercase font-cyber">Username</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#080e18] border border-sky-500/20 text-sm outline-none focus:border-sky-400 text-white font-mono"
                />
              </div>

              {/* Animated Avatar Selector */}
              <div>
                <label className="text-xs text-sky-400/60 block mb-2 uppercase font-cyber flex items-center gap-2">
                  <FaRobot className="text-sky-400" />
                  Select User Avatar
                </label>
                <div className="grid grid-cols-4 gap-3">
                  <button
                    type="button"
                    title="No Avatar"
                    onClick={() => {
                      setSelectedAvatar("");
                      setUploadedFile(null);
                      setUploadPreview("");
                    }}
                    className={`relative p-1.5 rounded-xl border-2 transition-all duration-200 bg-[#080e18] group flex flex-col justify-center items-center ${
                      selectedAvatar === "" && !uploadedFile
                        ? "border-sky-400 scale-105 shadow-[0_0_16px_rgba(56,189,248,0.5)]"
                        : "border-sky-500/20 hover:border-sky-500/40 hover:scale-105"
                    }`}
                  >
                    <div className="w-14 h-14 rounded-lg bg-[#111927] border border-sky-500/20 flex items-center justify-center text-sky-400/40">
                      <FaUserCircle size={28} />
                    </div>
                    <p className="text-[9px] text-sky-400/60 group-hover:text-slate-200 mt-1 text-center truncate font-cyber">
                      None
                    </p>
                  </button>

                  {PREDEFINED_AVATARS.map((avatar) => {
                    const isSelected = selectedAvatar === avatar.url && !uploadedFile;
                    return (
                      <button
                        key={avatar.id}
                        type="button"
                        title={avatar.name}
                        onClick={() => {
                          setSelectedAvatar(avatar.url);
                          setUploadedFile(null);
                          setUploadPreview("");
                        }}
                        className={`relative p-1.5 rounded-xl border-2 transition-all duration-200 bg-[#080e18] group ${
                          isSelected
                            ? "border-sky-400 scale-105 shadow-[0_0_16px_rgba(56,189,248,0.5)]"
                            : "border-sky-500/20 hover:border-sky-500/40 hover:scale-105"
                        }`}
                      >
                        <img
                          src={avatar.url}
                          alt={avatar.name}
                          className={`w-14 h-14 object-cover rounded-lg transition-all ${
                            isSelected ? "animate-pulse" : ""
                          }`}
                        />
                        <p className="text-[9px] text-sky-400/60 group-hover:text-slate-200 mt-1 text-center truncate font-cyber">
                          {avatar.name}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="text-xs text-sky-400/60 block mb-2 uppercase font-cyber flex items-center gap-2">
                  <FaUpload className="text-sky-400" />
                  Upload Custom Avatar
                </label>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`relative rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 py-5
                    ${dragOver
                      ? "border-sky-400 bg-sky-500/10 shadow-[0_0_20px_rgba(56,189,248,0.2)]"
                      : uploadedFile
                        ? "border-sky-500/60 bg-sky-500/5"
                        : "border-sky-500/20 hover:border-sky-400/50 hover:bg-[#131f33]"
                    }`}
                >
                  {uploadPreview ? (
                    <img
                      src={uploadPreview}
                      alt="preview"
                      className="w-20 h-20 rounded-xl object-cover border-2 border-sky-400/40"
                    />
                  ) : (
                    <FaUpload className="text-3xl text-sky-400/40" />
                  )}
                  <p className="text-xs text-sky-300 font-cyber">
                    {uploadedFile
                      ? <span className="text-sky-400">✔ {uploadedFile.name}</span>
                      : dragOver
                        ? "Drop image here"
                        : "Click or drag image to upload"}
                  </p>
                  <p className="text-[10px] text-sky-400/50">PNG • JPG • WEBP • SVG</p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />

                {uploadedFile && (
                  <button
                    type="button"
                    onClick={() => { setUploadedFile(null); setUploadPreview(""); }}
                    className="mt-2 text-xs text-sky-400/60 hover:text-rose-400 transition-colors font-cyber"
                  >
                    ✕ Remove uploaded image
                  </button>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setEditing(false);
                  setUploadedFile(null);
                  setUploadPreview("");
                  setSelectedAvatar(user.profile_pic || "");
                }}
                className="px-4 py-2 rounded-xl bg-[#080e18] hover:bg-[#131f33] border border-sky-500/20 text-xs font-cyber cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleProfileUpdate}
                disabled={uploading}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs font-cyber glow-cyan cursor-pointer disabled:opacity-60 shadow-lg shadow-sky-500/25"
              >
                {uploading ? "Uploading..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Change Password Modal ===== */}
      {passwordPopup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111927] border border-sky-500/30 rounded-2xl w-[450px] p-6 shadow-2xl">
            <h2 className="text-xl font-bold font-serif-header text-sky-400 mb-6 glow-text-cyan">
              Change Credentials Key
            </h2>

            {pwdError && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-cyber">
                ⚠ {pwdError}
              </div>
            )}
            {pwdSuccess && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-cyber">
                ✔ {pwdSuccess}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs text-sky-400/60 block mb-1 uppercase font-cyber">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#080e18] border border-sky-500/20 text-sm outline-none focus:border-sky-400 text-white"
                />
              </div>

              <div>
                <label className="text-xs text-sky-400/60 block mb-1 uppercase font-cyber">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#080e18] border border-sky-500/20 text-sm outline-none focus:border-sky-400 text-white"
                />

                {newPassword.length > 0 && (
                  <div className="mt-3 p-3 bg-[#080e18] border border-sky-500/15 rounded-xl space-y-1 text-[11px] font-cyber">
                    <p className="text-[10px] text-sky-400/60 uppercase tracking-wider mb-1.5">Strength Requirements:</p>
                    <div className="flex items-center gap-1.5">
                      <span className={hasMinLength ? "text-emerald-400" : "text-sky-400/40"}>
                        {hasMinLength ? "✔" : "○"} 8+ characters
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={hasCapital ? "text-emerald-400" : "text-sky-400/40"}>
                        {hasCapital ? "✔" : "○"} 1 capital letter (A-Z)
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={hasLowercase ? "text-emerald-400" : "text-sky-400/40"}>
                        {hasLowercase ? "✔" : "○"} 1 lowercase letter (a-z)
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={hasNumber ? "text-emerald-400" : "text-sky-400/40"}>
                        {hasNumber ? "✔" : "○"} 1 number (0-9)
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={hasSpecial ? "text-emerald-400" : "text-sky-400/40"}>
                        {hasSpecial ? "✔" : "○"} 1 special char (!@#$...)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs text-sky-400/60 block mb-1 uppercase font-cyber">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#080e18] border border-sky-500/20 text-sm outline-none focus:border-sky-400 text-white"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setPasswordPopup(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setPwdError("");
                  setPwdSuccess("");
                }}
                className="flex-1 bg-[#080e18] hover:bg-[#131f33] border border-sky-500/20 py-2.5 rounded-xl text-xs font-cyber cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                disabled={loading || (newPassword.length > 0 && !isPasswordValid)}
                className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 disabled:opacity-50 text-white py-2.5 rounded-xl text-xs font-cyber font-bold glow-cyan cursor-pointer shadow-lg shadow-sky-500/25"
              >
                {loading ? "Updating..." : "Save Key"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;