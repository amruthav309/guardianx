import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  sendForgotPasswordOTP,
  verifyForgotPasswordOTP,
  changePassword,
} from "../services/auth";

function ForgotPassword() {

  const navigate = useNavigate();

  // Step
  const [step, setStep] = useState(1);

  // Form Data
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // ===============================
  // Send OTP
  // ===============================

  const handleSendOTP = async () => {

    if (!email) {
      alert("Please enter your email.");
      return;
    }

    try {

      setLoading(true);

      await sendForgotPasswordOTP(email);

      alert("OTP sent successfully.");

      setStep(2);

    } catch {

      alert("Unable to send OTP.");

    } finally {

      setLoading(false);

    }

  };

  // ===============================
  // Verify OTP
  // ===============================

  const handleVerifyOTP = async () => {

    if (otp.length !== 6) {
      alert("Enter a valid 6-digit OTP.");
      return;
    }

    try {

      await verifyForgotPasswordOTP(
        email,
        otp
      );

      setStep(3);

    } catch {

      alert("Invalid OTP.");

    }

  };

  // ===============================
  // Update Password
  // ===============================

  const handleUpdatePassword = async () => {

    if (!newPassword || !confirmPassword) {
      alert("Please fill all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {

      setLoading(true);

      await changePassword({
        email,
        new_password: newPassword,
      });

      alert("Password updated successfully.");

      navigate("/login");

    } catch {

      alert("Unable to update password.");

    } finally {

      setLoading(false);

    }

  };

  return (

  <div className="min-h-screen flex items-center justify-center bg-[#09090B] text-white">

    <div className="w-full max-w-md bg-[#161616] rounded-2xl border border-cyan-500/20 shadow-2xl p-8">

      <h1 className="text-3xl font-bold text-cyan-400 text-center">
        GuardianX
      </h1>

      <p className="text-zinc-400 text-center mt-2">
        Secure Password Recovery
      </p>

      {/* STEP 1 */}

      {step === 1 && (

        <>

          <h2 className="text-xl font-semibold mt-8">
            Forgot Password
          </h2>

          <p className="text-zinc-400 mt-2 text-sm">
            Enter your registered email address.
          </p>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Registered Email"
            className="w-full mt-6 bg-[#202020] border border-zinc-700 rounded-lg p-3 outline-none focus:border-cyan-400"
          />

          <button
            onClick={handleSendOTP}
            disabled={loading}
            className="w-full mt-6 bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-lg transition"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>

        </>

      )}

      {/* STEP 2 */}

      {step === 2 && (

        <>

          <h2 className="text-xl font-semibold mt-8">
            Verify OTP
          </h2>

          <p className="text-zinc-400 mt-2 text-sm">
            Enter the 6-digit OTP sent to your email.
          </p>

          <div className="mt-4 bg-[#202020] p-3 rounded-lg text-center text-cyan-400">
            {email.replace(/(.{1}).+(@.+)/, "$1********$2")}
          </div>

          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full mt-6 bg-[#202020] border border-zinc-700 rounded-lg p-3 text-center tracking-[10px] text-xl outline-none focus:border-cyan-400"
          />

          <button
            onClick={handleVerifyOTP}
            className="w-full mt-6 bg-green-500 hover:bg-green-600 text-black font-bold py-3 rounded-lg"
          >
            Verify OTP
          </button>

          <button
            onClick={handleSendOTP}
            className="w-full mt-3 border border-cyan-500 text-cyan-400 py-3 rounded-lg hover:bg-cyan-500 hover:text-black"
          >
            Resend OTP
          </button>

        </>

      )}

      {/* STEP 3 */}

      {step === 3 && (

        <>

          <h2 className="text-xl font-semibold mt-8">
            Create New Password
          </h2>

          <p className="text-zinc-400 mt-2 text-sm">
            Your identity has been verified.
          </p>

          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            className="w-full mt-6 bg-[#202020] border border-zinc-700 rounded-lg p-3 outline-none focus:border-cyan-400"
          />

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="w-full mt-4 bg-[#202020] border border-zinc-700 rounded-lg p-3 outline-none focus:border-cyan-400"
          />

          <button
            onClick={handleUpdatePassword}
            disabled={loading}
            className="w-full mt-6 bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-lg"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>

        </>

      )}

      <button
        onClick={() => navigate("/login")}
        className="w-full mt-8 text-cyan-400 hover:underline"
      >
        ← Back to Login
      </button>

    </div>

  </div>

);

}

export default ForgotPassword;