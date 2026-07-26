import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyEmail, resendOTP } from "../services/auth";
import { FaShieldAlt, FaEnvelope } from "react-icons/fa";

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState<"success" | "error">("success");

  const [previewOtp, setPreviewOtp] = useState(location.state?.otp_code || "");

  const verifyOTP = async () => {
    setMessage("");
    if (otp.length !== 6) {
      setMsgType("error");
      setMessage("Please enter a valid 6-digit OTP.");
      return;
    }
    try {
      setLoading(true);
      await verifyEmail(email, otp);
      setMsgType("success");
      setMessage("Email Verified Successfully. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setMsgType("error");
      setMessage(
        err?.response?.data?.detail ||
        err?.message ||
        "Invalid or expired OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  const resendOTPHandler = async () => {
    setMessage("");
    try {
      setResending(true);
      const res = await resendOTP(email);
      if (res?.otp_code) {
        setPreviewOtp(res.otp_code);
      }
      setMsgType("success");
      setMessage("OTP code has been generated and sent to your email.");
    } catch {
      setMsgType("error");
      setMessage("Unable to resend OTP. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#070709] text-white relative overflow-hidden page-enter">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />

      <div className="glass-panel-cyan w-[440px] rounded-2xl border border-cyan-500/25 p-8 shadow-2xl relative z-20">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-xl bg-cyan-500/15 flex items-center justify-center border border-cyan-500/30 glow-cyan mb-4">
            <FaShieldAlt className="text-3xl text-cyan-400" />
          </div>
          <h1 className="text-3xl font-bold font-cyber text-cyan-400 glow-text-cyan tracking-wider">
            GUARDIAN<span className="text-white">X</span>
          </h1>
          <p className="text-zinc-400 text-sm mt-1">EMAIL IDENTITY VERIFICATION</p>
        </div>

        {/* Email display */}
        <div className="flex items-center gap-3 bg-[#0e0e11] border border-zinc-800 rounded-xl p-4 mb-4">
          <FaEnvelope className="text-cyan-400 text-lg flex-shrink-0" />
          <div>
            <p className="text-[10px] text-zinc-500 font-cyber uppercase">OTP Sent To</p>
            <p className="text-sm text-emerald-400 font-mono mt-0.5">{email || "your email"}</p>
          </div>
        </div>

        {/* Verification Code Preview / Auto-fill */}
        {previewOtp && (
          <div className="mb-6 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-300 text-xs font-cyber flex items-center justify-between">
            <span>🔒 Verification Code: <strong className="text-white font-mono text-sm tracking-widest">{previewOtp}</strong></span>
            <button type="button" onClick={() => setOtp(previewOtp)} className="bg-cyan-500 hover:bg-cyan-400 text-black px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer">Auto-Fill</button>
          </div>
        )}

        {/* OTP Input */}
        <div className="mb-2">
          <label className="text-xs text-zinc-400 block mb-2 uppercase font-cyber">6-Digit OTP Code</label>
          <input
            className="w-full bg-[#0e0e11] border border-zinc-800 rounded-xl p-4 text-center tracking-[12px] text-xl font-mono outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 text-white transition-all"
            placeholder="• • • • • •"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          />
        </div>
        <p className="text-[10px] text-zinc-600 font-cyber mb-6 text-center">Enter the 6-digit code sent to your email. Valid for 5 minutes.</p>

        {/* Message Banner */}
        {message && (
          <div className={`mb-6 p-3 rounded-xl border text-xs font-cyber ${
            msgType === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}>
            {msgType === "success" ? "✔" : "⚠"} {message}
          </div>
        )}

        {/* Verify Button */}
        <button
          onClick={verifyOTP}
          disabled={loading || otp.length !== 6}
          className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-700/40 disabled:cursor-not-allowed text-black font-bold py-3 rounded-xl font-cyber tracking-widest text-sm transition-all glow-cyan cursor-pointer"
        >
          {loading ? "VERIFYING..." : "VERIFY IDENTITY"}
        </button>

        {/* Resend OTP */}
        <button
          onClick={resendOTPHandler}
          disabled={resending}
          className="w-full mt-3 border border-zinc-700 hover:border-cyan-500/50 text-zinc-400 hover:text-cyan-400 py-3 rounded-xl font-cyber text-sm transition-all cursor-pointer"
        >
          {resending ? "Sending..." : "Resend OTP"}
        </button>

        <button
          onClick={() => navigate("/login")}
          className="w-full mt-4 text-zinc-600 hover:text-cyan-400 font-cyber text-xs transition-colors cursor-pointer"
        >
          ← Back to Login
        </button>
      </div>
    </div>
  );
}

export default VerifyEmail;