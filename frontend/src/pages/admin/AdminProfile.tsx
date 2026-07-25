import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "motion/react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getCurrentUser, default as API } from "../../services/auth";
import {
  FaUserShield,
  FaKey,
  FaLock,
  FaCheckCircle,
  FaShieldAlt,
  FaPaperPlane,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

function AdminProfile() {
  const user = getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/admin/login" replace />;
  }

  const [adminProfile, setAdminProfile] = useState({
    name: "Master Security Admin",
    email: "amruthav309@gmail.com",
    security_level: "Lockdown",
    security_key: "GX-ROOT-9901",
  });

  const [form, setForm] = useState({
    new_email: "",
    new_password: "",
    new_security_key: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [previewOtp, setPreviewOtp] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await API.get("/admin/profile");
      setAdminProfile(res.data);
      setForm((prev) => ({
        ...prev,
        new_email: res.data.email,
        new_security_key: res.data.security_key,
      }));
    } catch {
      // Fallback
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await API.post("/admin/send-verification", {
        email: adminProfile.email,
      });

      setMessage(res.data.message || `Verification code sent to ${adminProfile.email}`);
      if (res.data.otp_code) {
        setPreviewOtp(res.data.otp_code);
      }
      setOtpModalOpen(true);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to send verification code to admin email.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSecurityChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!otpCode.trim()) {
      setError("6-digit verification code is required.");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/admin/update-credentials", {
        email: adminProfile.email,
        new_email: form.new_email || undefined,
        new_password: form.new_password || undefined,
        new_security_key: form.new_security_key || undefined,
        otp_code: otpCode,
      });

      setMessage(res.data.message || "Admin security credentials updated successfully!");
      
      // Update local storage and profile state
      const updatedUser = {
        ...user,
        email: form.new_email || user.email,
      };
      localStorage.setItem("guardianx_user", JSON.stringify(updatedUser));
      
      setAdminProfile((prev) => ({
        ...prev,
        email: form.new_email || prev.email,
        security_key: form.new_security_key || prev.security_key,
      }));

      setOtpModalOpen(false);
      setOtpCode("");
      setForm((prev) => ({ ...prev, new_password: "" }));
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to update security credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold font-cyber text-red-400 glow-text-red flex items-center gap-2">
            <FaUserShield />
            <span>Admin Security Profile & Credential Management</span>
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Authorized admin clearance configuration — verified against primary email: <span className="text-red-400 font-bold">{adminProfile.email}</span>
          </p>
        </div>

        {/* Status Banners */}
        {message && (
          <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs font-cyber flex items-center gap-2">
            <FaCheckCircle className="text-emerald-400 text-sm" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/15 border border-red-500/30 rounded-2xl text-red-400 text-xs font-cyber flex items-center gap-2">
            ⚠ {error}
          </div>
        )}

        {/* Profile Card & Security Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Identity Overview */}
          <div className="bg-[#0c0709] border border-red-500/30 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
            <div className="hud-corner-red-tl" />
            <div className="hud-corner-red-tr" />

            <div>
              <div className="w-16 h-16 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 text-3xl mb-4 shadow-[0_0_20px_rgba(220,38,38,0.3)]">
                <FaUserShield />
              </div>
              <h2 className="text-xl font-bold font-cyber text-white">{adminProfile.name}</h2>
              <p className="text-xs text-red-400 font-mono font-bold mt-0.5">● SUPER ADMIN ROOT</p>

              <div className="mt-6 space-y-3 font-mono text-xs text-zinc-300">
                <div className="p-3 bg-[#13080c] rounded-xl border border-red-500/20 flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-500 uppercase font-cyber">Primary Email ID</span>
                  <span className="text-red-300 font-bold break-all">{adminProfile.email}</span>
                </div>
                <div className="p-3 bg-[#13080c] rounded-xl border border-red-500/20 flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-500 uppercase font-cyber">Security Clearance</span>
                  <span className="text-red-400 font-bold font-cyber">{adminProfile.security_level}</span>
                </div>
                <div className="p-3 bg-[#13080c] rounded-xl border border-red-500/20 flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-500 uppercase font-cyber">Active Security Key</span>
                  <span className="text-amber-300 font-mono font-bold tracking-wider">{adminProfile.security_key}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-red-500/20 text-[10px] font-cyber text-zinc-500 text-center uppercase">
              GX ADMIN AUTH CLEARANCE v1.0
            </div>
          </div>

          {/* Security Credentials Update Form */}
          <div className="lg:col-span-2 bg-[#0c0709] border border-red-500/30 rounded-2xl p-6 relative">
            <div className="hud-corner-red-bl" />
            <div className="hud-corner-red-br" />

            <h2 className="text-lg font-bold font-cyber text-white mb-2 flex items-center gap-2">
              <FaLock className="text-red-400" />
              <span>Modify Admin Email, Password & Security Key</span>
            </h2>
            <p className="text-xs text-zinc-400 font-mono mb-6">
              Security updates require OTP verification code sent to <span className="text-red-300 font-bold">amruthav309@gmail.com</span>
            </p>

            <form onSubmit={handleRequestOtp} className="space-y-4 font-mono text-xs">
              <div>
                <label className="text-xs text-zinc-400 block mb-1 uppercase font-cyber tracking-wider">Admin Email Address</label>
                <input
                  type="email"
                  value={form.new_email}
                  onChange={(e) => setForm({ ...form, new_email: e.target.value })}
                  required
                  className="w-full p-3 pl-4 rounded-xl bg-[#13080c] border border-red-500/30 text-white outline-none focus:border-red-400"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1 uppercase font-cyber tracking-wider">New Master Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password (or leave unchanged)"
                    value={form.new_password}
                    onChange={(e) => setForm({ ...form, new_password: e.target.value })}
                    className="w-full p-3 pl-4 pr-12 rounded-xl bg-[#13080c] border border-red-500/30 text-white outline-none focus:border-red-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-zinc-500 hover:text-white"
                  >
                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1 uppercase font-cyber tracking-wider">Master Security Key (2FA Token)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.new_security_key}
                    onChange={(e) => setForm({ ...form, new_security_key: e.target.value })}
                    required
                    className="w-full p-3 pl-4 pr-10 rounded-xl bg-[#13080c] border border-red-500/30 text-red-300 font-mono tracking-widest outline-none focus:border-red-400"
                  />
                  <FaKey className="absolute right-3.5 top-3.5 text-red-400 text-xs" />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-cyber font-bold text-xs tracking-widest transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FaPaperPlane size={12} />
                  {loading ? "SENDING VERIFICATION OTP..." : "VERIFY VIA EMAIL & SAVE SECURITY CHANGES"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* OTP Verification Modal */}
        {otpModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#0d070a] border border-red-500/40 rounded-2xl p-6 w-full max-w-md relative shadow-2xl space-y-4 text-white"
            >
              <div className="hud-corner-red-tl" />
              <div className="hud-corner-red-tr" />

              <div className="flex flex-col items-center mb-2">
                <div className="w-12 h-12 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 text-xl mb-2">
                  <FaShieldAlt />
                </div>
                <h2 className="text-lg font-bold font-cyber text-white">Security Verification Required</h2>
                <p className="text-xs text-zinc-400 text-center mt-1">
                  A 6-digit OTP verification code was sent to <span className="text-red-300 font-bold">{adminProfile.email}</span>
                </p>
              </div>

              {previewOtp && (
                <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-mono text-center">
                  🔑 Verification OTP: <strong className="text-white bg-black/40 px-2 py-0.5 rounded tracking-widest">{previewOtp}</strong>
                </div>
              )}

              <form onSubmit={handleSaveSecurityChanges} className="space-y-4">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1 uppercase font-cyber">6-Digit OTP Code</label>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl bg-[#14080c] border border-red-500/40 text-center text-lg font-mono tracking-widest text-red-300 outline-none focus:border-red-400"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setOtpModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 font-cyber text-xs text-zinc-300 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 font-cyber text-xs text-white font-bold tracking-wider shadow-[0_0_15px_rgba(220,38,38,0.3)] cursor-pointer"
                  >
                    {loading ? "SAVING..." : "CONFIRM UPDATE"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminProfile;
