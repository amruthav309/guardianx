import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
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
  const user = getCurrentUser();

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

      // If the user uploaded a file, upload it first
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
    <div className="flex min-h-screen bg-[#070709] text-white page-enter">
      {sidebarOpen && <Sidebar />}

      <div className="flex-1 p-6 overflow-y-auto">
        <Topbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="mt-8">
          <h1 className="text-3xl font-bold font-cyber text-cyan-400 glow-text-cyan">
            Security Profile
          </h1>
          <p className="text-zinc-500 text-xs mt-1">
            Manage your GuardianX authorization identity.
          </p>
        </div>

        {/* User Card */}
        <div className="mt-8 glass-panel-cyan rounded-xl p-8 border border-cyan-500/25 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
            {user.profile_pic ? (
              <img
                src={user.profile_pic}
                alt={user.name}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-cyan-500/40 glow-cyan bg-[#0e0e11]"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <FaUserCircle size={60} />
              </div>
            )}

            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold font-cyber text-zinc-100">
                {user.name || "User Agent"}
              </h2>
              {/* FIXED: "Agent username:" → "Agent:" */}
              <p className="text-xs text-cyan-400 font-mono mt-1 uppercase tracking-widest glow-text-cyan">
                Agent: @{user.username || "anonymous"}
              </p>
              <button
                onClick={() => setEditing(true)}
                className="mt-4 bg-cyan-500 hover:bg-cyan-400 text-black px-5 py-2 rounded-lg text-xs font-bold font-cyber flex items-center justify-center gap-2 glow-cyan transition-all cursor-pointer mx-auto sm:mx-0"
              >
                <FaUserEdit size={14} />
                Edit Credentials
              </button>
            </div>
          </div>
        </div>

        {/* Metadata info cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <div className="bg-[#0e0e11]/80 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500 uppercase font-cyber">Identity Email</span>
              <FaEnvelope className="text-cyan-400 text-sm" />
            </div>
            <p className="text-sm font-mono font-semibold text-zinc-200 mt-4 break-all">
              {user.email || "N/A"}
            </p>
          </div>

          <div className="bg-[#0e0e11]/80 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500 uppercase font-cyber">Secure Phone</span>
              <FaPhone className="text-zinc-500 text-sm" />
            </div>
            <p className="text-sm font-semibold text-zinc-400 mt-4">
              None Configured
            </p>
          </div>

          <div className="bg-[#0e0e11]/80 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500 uppercase font-cyber">Security Status</span>
              <FaShieldAlt className="text-emerald-400 text-sm" />
            </div>
            <p className="text-sm font-semibold text-emerald-400 font-cyber mt-4">
              {user.account_status || "Active"}
            </p>
          </div>

          <div className="bg-[#0e0e11]/80 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500 uppercase font-cyber">Last Clearance</span>
              <FaCalendarAlt className="text-amber-400 text-sm" />
            </div>
            <p className="text-xs font-mono font-semibold text-zinc-300 mt-4">
              {user.last_login ? new Date(user.last_login).toLocaleString() : "Initial Login"}
            </p>
          </div>
        </div>

        {/* Security Controls */}
        <div className="mt-8 border-t border-zinc-800 pt-8">
          <h2 className="text-lg font-bold font-cyber text-cyan-400 glow-text-cyan mb-4">
            Security Controls
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0e0e11]/80 border border-zinc-800 rounded-xl p-5">
              <h3 className="font-cyber text-sm font-bold text-zinc-200">Session Statistics</h3>
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-zinc-800">
                  <span className="text-zinc-500">Authentication Count</span>
                  <span className="font-mono text-zinc-300">{user.login_count || 0}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800">
                  <span className="text-zinc-500">Application Version</span>
                  <span className="font-mono text-zinc-300">v2.0 (Premium)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-500">Segregated Database</span>
                  <span className="text-emerald-400 font-cyber">Isolated</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setPasswordPopup(true)}
              className="bg-[#0e0e11]/80 hover:bg-[#121217] border border-zinc-800 hover:border-cyan-500/30 rounded-xl p-5 text-left transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-400">
                  <FaShieldAlt size={18} />
                </div>
                <div>
                  <h4 className="font-cyber text-sm font-bold text-zinc-200">Credentials Key</h4>
                  <p className="text-zinc-500 text-xs mt-1">Change password for secure terminal entry</p>
                </div>
              </div>
              <span className="text-2xl text-zinc-600 group-hover:text-cyan-400 transition-colors">›</span>
            </button>
          </div>
        </div>
      </div>

      {/* ===== Edit Profile Modal ===== */}
      {editing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className="bg-[#121214] p-6 rounded-2xl w-full max-w-[520px] border border-cyan-500/30 shadow-2xl relative overflow-y-auto"
            style={{ maxHeight: "90vh" }}
          >
            <h2 className="text-xl font-bold font-cyber text-cyan-400 mb-6 glow-text-cyan">
              Modify Identity Details
            </h2>

            <div className="space-y-5">
              {/* Name */}
              <div>
                <label className="text-xs text-zinc-400 block mb-1 uppercase font-cyber">Full Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#0e0e11] border border-zinc-800 text-sm outline-none focus:border-cyan-500 text-white"
                />
              </div>

              {/* Username */}
              <div>
                <label className="text-xs text-zinc-400 block mb-1 uppercase font-cyber">Username</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#0e0e11] border border-zinc-800 text-sm outline-none focus:border-cyan-500 text-white"
                />
              </div>

              {/* Animated Avatar Selector */}
              <div>
                <label className="text-xs text-zinc-400 block mb-2 uppercase font-cyber flex items-center gap-2">
                  <FaRobot className="text-cyan-400" />
                  Select Agent Avatar
                </label>
                <div className="grid grid-cols-4 gap-3">
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
                        className={`relative p-1.5 rounded-xl border-2 transition-all duration-200 bg-[#0a0a0f] group ${
                          isSelected
                            ? "border-cyan-400 scale-105 shadow-[0_0_16px_rgba(6,182,212,0.5)]"
                            : "border-zinc-800 hover:border-zinc-600 hover:scale-105"
                        }`}
                      >
                        <img
                          src={avatar.url}
                          alt={avatar.name}
                          className={`w-14 h-14 object-cover rounded-lg transition-all ${
                            isSelected ? "animate-pulse" : ""
                          }`}
                        />
                        {isSelected && (
                          <div className="absolute inset-0 rounded-xl border-2 border-cyan-400/40 animate-ping pointer-events-none" />
                        )}
                        <p className="text-[9px] text-zinc-500 group-hover:text-zinc-300 mt-1 text-center truncate font-cyber">
                          {avatar.name}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* File Upload for Custom Avatar */}
              <div>
                <label className="text-xs text-zinc-400 block mb-2 uppercase font-cyber flex items-center gap-2">
                  <FaUpload className="text-cyan-400" />
                  Upload Custom Avatar
                </label>

                {/* Drop zone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`relative rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 py-5
                    ${dragOver
                      ? "border-cyan-400 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                      : uploadedFile
                        ? "border-emerald-500/60 bg-emerald-500/5"
                        : "border-zinc-700 hover:border-cyan-500/50 hover:bg-[#0e0e11]"
                    }`}
                >
                  {uploadPreview ? (
                    <img
                      src={uploadPreview}
                      alt="preview"
                      className="w-20 h-20 rounded-xl object-cover border-2 border-cyan-500/40"
                    />
                  ) : (
                    <FaUpload className="text-3xl text-zinc-600" />
                  )}
                  <p className="text-xs text-zinc-400 font-cyber">
                    {uploadedFile
                      ? <span className="text-emerald-400">✔ {uploadedFile.name}</span>
                      : dragOver
                        ? "Drop image here"
                        : "Click or drag image to upload"}
                  </p>
                  <p className="text-[10px] text-zinc-600">PNG • JPG • WEBP • SVG</p>
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
                    className="mt-2 text-xs text-zinc-500 hover:text-red-400 transition-colors font-cyber"
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
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-cyber cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleProfileUpdate}
                disabled={uploading}
                className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-cyber glow-cyan cursor-pointer disabled:opacity-60"
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
          <div className="bg-[#121214] border border-cyan-500/30 rounded-2xl w-[450px] p-6 shadow-2xl">
            <h2 className="text-xl font-bold font-cyber text-cyan-400 mb-6 glow-text-cyan">
              Change Credentials Key
            </h2>

            {pwdError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-cyber">
                ⚠ {pwdError}
              </div>
            )}
            {pwdSuccess && (
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-xs font-cyber">
                ✔ {pwdSuccess}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs text-zinc-400 block mb-1 uppercase font-cyber">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#0e0e11] border border-zinc-800 text-sm outline-none focus:border-cyan-500 text-white"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1 uppercase font-cyber">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#0e0e11] border border-zinc-800 text-sm outline-none focus:border-cyan-500 text-white"
                />

                {/* Password Validation Checklist */}
                {newPassword.length > 0 && (
                  <div className="mt-3 p-3 bg-[#0e0e11] border border-zinc-850 rounded-lg space-y-1 text-[11px] font-cyber">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1.5">Strength Requirements:</p>
                    <div className="flex items-center gap-1.5">
                      <span className={hasMinLength ? "text-emerald-400" : "text-zinc-600"}>
                        {hasMinLength ? "✔" : "○"} 8+ characters
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={hasCapital ? "text-emerald-400" : "text-zinc-600"}>
                        {hasCapital ? "✔" : "○"} 1 capital letter (A-Z)
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={hasLowercase ? "text-emerald-400" : "text-zinc-600"}>
                        {hasLowercase ? "✔" : "○"} 1 lowercase letter (a-z)
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={hasNumber ? "text-emerald-400" : "text-zinc-600"}>
                        {hasNumber ? "✔" : "○"} 1 number (0-9)
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={hasSpecial ? "text-emerald-400" : "text-zinc-600"}>
                        {hasSpecial ? "✔" : "○"} 1 special char (!@#$...)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1 uppercase font-cyber">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#0e0e11] border border-zinc-800 text-sm outline-none focus:border-cyan-500 text-white"
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
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-2.5 rounded-lg text-xs font-cyber cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                disabled={loading || (newPassword.length > 0 && !isPasswordValid)}
                className="flex-1 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-700/30 disabled:text-zinc-500 disabled:cursor-not-allowed text-black py-2.5 rounded-lg text-xs font-cyber font-bold glow-cyan cursor-pointer"
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