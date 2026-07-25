import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import API from "../../services/auth";
import { FaKey, FaEnvelope, FaCheckCircle, FaLock, FaArrowLeft, FaPaperPlane } from "react-icons/fa";

function AdminForgotKey() {
  const navigate = useNavigate();

  const [step, setStep] = useState<"EMAIL" | "RESET">("EMAIL");
  const [email, setEmail] = useState("amruthav309@gmail.com");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newSecurityKey, setNewSecurityKey] = useState("GX-ROOT-9901");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [previewOtp, setPreviewOtp] = useState("");

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await API.post("/admin/forgot-security-key", { email });
      setMessage(res.data.message || `Verification code sent to ${email}`);
      if (res.data.otp_code) {
        setPreviewOtp(res.data.otp_code);
      }
      setStep("RESET");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to send verification code. Ensure you use primary admin email.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!otpCode.trim()) {
      setError("Please enter the 6-digit OTP code sent to your email.");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/admin/reset-security-credentials", {
        email,
        otp_code: otpCode,
        new_password: newPassword || undefined,
        new_security_key: newSecurityKey || undefined,
      });

      setMessage(res.data.message || "Admin credentials reset successfully!");

      setTimeout(() => {
        navigate("/admin/login");
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to reset credentials. Please verify your OTP code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060406] flex justify-center items-center relative overflow-hidden page-enter px-4 text-white">
      {/* Crimson Cyber Laser Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#dc26260f_1px,transparent_1px),linear-gradient(to_bottom,#dc26260f_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]"></div>
      
      {/* Ambient Crimson Red Background Glows */}
      <motion.div
        animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/30 rounded-full blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[480px] bg-[#0c0709]/95 p-8 rounded-2xl relative z-20 border border-red-500/40 shadow-[0_0_50px_rgba(220,38,38,0.25)]"
      >
        <div className="hud-corner-red-tl" />
        <div className="hud-corner-red-tr" />
        <div className="hud-corner-red-bl" />
        <div className="hud-corner-red-br" />

        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-xl bg-red-600/20 flex items-center justify-center border border-red-500/50 shadow-[0_0_20px_rgba(220,38,38,0.3)] mb-3">
            <FaKey className="text-2xl text-red-400" />
          </div>

          <h1 className="text-2xl font-bold text-zinc-100 font-cyber tracking-wider text-center">
            RECOVER ADMIN <span className="text-red-500 glow-text-red">SECURITY KEY</span>
          </h1>

          <p className="text-center text-red-400/90 text-xs mt-1 font-cyber tracking-widest uppercase">
            OTP EMAIL VERIFICATION & CREDENTIAL RECOVERY
          </p>
        </div>

        {step === "EMAIL" ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div className="p-3.5 bg-[#17090d] border border-red-500/40 rounded-xl text-xs font-mono text-zinc-300">
              <p className="font-cyber font-bold text-red-400 mb-1 flex items-center gap-1.5">
                <FaEnvelope /> Admin Verification Email:
              </p>
              <p className="text-zinc-400">
                Security recovery OTP code will be sent to the primary admin email address: <span className="text-red-300 font-bold">amruthav309@gmail.com</span>
              </p>
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-1 uppercase font-cyber tracking-wider">Confirm Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 pl-4 rounded-lg bg-[#0d070a] border border-red-500/40 text-sm outline-none focus:border-red-400 text-white font-mono"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/15 border border-red-500/30 rounded-lg text-red-400 text-xs font-cyber">
                ⚠ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-red-600 hover:bg-red-500 disabled:bg-red-800/50 text-white font-bold p-3.5 rounded-xl font-cyber tracking-widest text-xs transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <FaPaperPlane size={12} />
              {loading ? "SENDING VERIFICATION CODE..." : "SEND VERIFICATION CODE"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetCredentials} className="space-y-4">
            {message && (
              <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs font-cyber flex flex-col gap-1">
                <span className="font-bold flex items-center gap-1.5">
                  <FaCheckCircle /> {message}
                </span>
                {previewOtp && (
                  <span className="text-[11px] font-mono text-emerald-400">
                    🔑 Security OTP Code: <strong className="text-white bg-black/40 px-2 py-0.5 rounded tracking-widest">{previewOtp}</strong>
                  </span>
                )}
              </div>
            )}

            <div>
              <label className="text-xs text-zinc-400 block mb-1 uppercase font-cyber tracking-wider">6-Digit Verification OTP Code</label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP (e.g. 892147)"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                required
                className="w-full p-3 pl-4 rounded-lg bg-[#0d070a] border border-red-500/40 text-sm outline-none focus:border-red-400 text-red-300 font-mono tracking-widest"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-1 uppercase font-cyber tracking-wider">New Master Admin Password</label>
              <input
                type="password"
                placeholder="Enter new password (optional)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 pl-4 rounded-lg bg-[#0d070a] border border-red-500/30 text-sm outline-none focus:border-red-400 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-1 uppercase font-cyber tracking-wider">New Master Security Key</label>
              <input
                type="text"
                placeholder="GX-ROOT-9901"
                value={newSecurityKey}
                onChange={(e) => setNewSecurityKey(e.target.value)}
                className="w-full p-3 pl-4 rounded-lg bg-[#0d070a] border border-red-500/40 text-sm outline-none focus:border-red-400 text-red-300 font-mono tracking-widest"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/15 border border-red-500/30 rounded-lg text-red-400 text-xs font-cyber">
                ⚠ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-red-600 hover:bg-red-500 disabled:bg-red-800/50 text-white font-bold p-3.5 rounded-xl font-cyber tracking-widest text-xs transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <FaLock size={12} />
              {loading ? "RESETTING CREDENTIALS..." : "RESET PASSWORD & SECURITY KEY"}
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-red-500/20 flex justify-between items-center text-xs font-cyber">
          <Link to="/admin/login" className="text-red-400 hover:underline flex items-center gap-1.5">
            <FaArrowLeft size={10} /> Back to Admin Login
          </Link>
          <span className="text-zinc-600 text-[10px]">GX-RECOVERY-v1.0</span>
        </div>
      </motion.div>
    </div>
  );
}

export default AdminForgotKey;
