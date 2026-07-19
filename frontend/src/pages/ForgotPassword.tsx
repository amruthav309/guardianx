import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  sendForgotPasswordOTP,
  verifyForgotPasswordOTP,
  changePassword,
} from "../services/auth";
import { FaShieldAlt, FaEye, FaEyeSlash } from "react-icons/fa";

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const hasMinLength = newPassword.length >= 8;
  const hasCapital = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const isPasswordValid = hasMinLength && hasCapital && hasLowercase && hasNumber && hasSpecial;

  const handleSendOTP = async () => {
    setError("");
    setSuccess("");
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    try {
      setLoading(true);
      await sendForgotPasswordOTP(email);
      setSuccess("OTP sent successfully to your email.");
      setTimeout(() => {
        setSuccess("");
        setStep(2);
      }, 1500);
    } catch {
      setError("Unable to send OTP. Please check your email.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setError("");
    setSuccess("");
    if (otp.length !== 6) {
      setError("Enter a valid 6-digit OTP.");
      return;
    }
    try {
      setLoading(true);
      await verifyForgotPasswordOTP(email, otp);
      setSuccess("OTP Verified successfully.");
      setTimeout(() => {
        setSuccess("");
        setStep(3);
      }, 1500);
    } catch {
      setError("Invalid OTP code.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    setError("");
    setSuccess("");
    if (!newPassword || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }
    if (!isPasswordValid) {
      setError("Password does not meet the security requirements.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      setLoading(true);
      await changePassword({ email, new_password: newPassword });
      setSuccess("Password updated successfully.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Unable to update password.");
      }
    } finally {
      setLoading(false);
    }
  };

  const steps = ["Enter Email", "Verify OTP", "New Password"];

  return (
    <div className="min-h-screen bg-[#070709] flex justify-center items-center relative overflow-hidden page-enter text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />

      <div className="glass-panel-cyan w-[440px] rounded-2xl border border-cyan-500/25 p-8 shadow-2xl relative z-20">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-xl bg-cyan-500/15 flex items-center justify-center border border-cyan-500/30 glow-cyan mb-3">
            <FaShieldAlt className="text-2xl text-cyan-400" />
          </div>
          <h1 className="text-3xl font-bold font-cyber text-cyan-400 glow-text-cyan tracking-wider">
            GUARDIAN<span className="text-white">X</span>
          </h1>
          <p className="text-zinc-400 text-xs mt-1 font-cyber uppercase">Secure Password Recovery</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-cyber flex-shrink-0 border ${
                i + 1 < step
                  ? "bg-cyan-500 border-cyan-500 text-black"
                  : i + 1 === step
                  ? "border-cyan-500 text-cyan-400"
                  : "border-zinc-700 text-zinc-600"
              }`}>
                {i + 1 < step ? "✓" : i + 1}
              </div>
              <span className={`text-[9px] font-cyber uppercase truncate ${i + 1 === step ? "text-cyan-400" : "text-zinc-600"}`}>{s}</span>
              {i < steps.length - 1 && <div className={`flex-1 h-px ${i + 1 < step ? "bg-cyan-500" : "bg-zinc-800"}`} />}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-cyber">
            ⚠ {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-xs font-cyber">
            ✔ {success}
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-bold font-cyber text-zinc-200 mb-1">Enter Email Address</p>
              <p className="text-xs text-zinc-500 mb-4">We'll send a one-time code to your registered email.</p>
            </div>
            <div>
              <label className="text-xs text-zinc-400 block mb-1 uppercase font-cyber">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="identity@domain.com"
                className="w-full p-3 rounded-lg bg-[#0e0e11] border border-zinc-800 text-sm outline-none focus:border-cyan-500 text-white transition-all"
              />
            </div>
            <button
              onClick={handleSendOTP}
              disabled={loading}
              className="w-full mt-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-700/50 text-black font-bold py-3 rounded-lg font-cyber tracking-widest text-sm transition-all glow-cyan cursor-pointer"
            >
              {loading ? "SENDING OTP..." : "SEND OTP"}
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-bold font-cyber text-zinc-200 mb-1">Verify OTP Code</p>
              <p className="text-xs text-zinc-500 mb-4">Enter the 6-digit code sent to <span className="text-emerald-400 font-mono">{email}</span></p>
            </div>
            <div>
              <label className="text-xs text-zinc-400 block mb-1 uppercase font-cyber">OTP Code</label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="• • • • • •"
                className="w-full p-4 rounded-lg bg-[#0e0e11] border border-zinc-800 text-center tracking-[12px] text-xl font-mono outline-none focus:border-cyan-500 text-white transition-all"
              />
            </div>
            <button
              onClick={handleVerifyOTP}
              disabled={loading || otp.length !== 6}
              className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-700/50 disabled:cursor-not-allowed text-black font-bold py-3 rounded-lg font-cyber tracking-widest text-sm transition-all glow-cyan cursor-pointer"
            >
              {loading ? "VERIFYING..." : "VERIFY OTP"}
            </button>
            <button
              onClick={handleSendOTP}
              disabled={loading}
              className="w-full border border-zinc-700 hover:border-cyan-500/50 text-zinc-400 hover:text-cyan-400 py-3 rounded-lg font-cyber text-sm transition-all cursor-pointer"
            >
              Resend OTP
            </button>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-bold font-cyber text-zinc-200 mb-1">Set New Password</p>
              <p className="text-xs text-zinc-500 mb-4">Your identity has been verified. Create a strong new password.</p>
            </div>
            <div>
              <label className="text-xs text-zinc-400 block mb-1 uppercase font-cyber">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full p-3 pr-12 rounded-lg bg-[#0e0e11] border border-zinc-800 text-sm outline-none focus:border-cyan-500 text-white transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-zinc-500 hover:text-cyan-400 transition-colors">
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>

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
                placeholder="••••••••••••"
                className="w-full p-3 rounded-lg bg-[#0e0e11] border border-zinc-800 text-sm outline-none focus:border-cyan-500 text-white transition-all"
              />
            </div>
            <button
              onClick={handleUpdatePassword}
              disabled={loading || (newPassword.length > 0 && !isPasswordValid)}
              className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-700/30 disabled:text-zinc-500 disabled:cursor-not-allowed text-black font-bold py-3 rounded-lg font-cyber tracking-widest text-sm transition-all glow-cyan cursor-pointer"
            >
              {loading ? "UPDATING..." : "UPDATE PASSWORD"}
            </button>
          </div>
        )}

        <button
          onClick={() => navigate("/login")}
          className="w-full mt-6 text-zinc-600 hover:text-cyan-400 font-cyber text-xs transition-colors cursor-pointer"
        >
          ← Back to Login
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;