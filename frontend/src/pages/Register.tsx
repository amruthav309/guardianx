import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/auth";
import { FaShieldAlt, FaEye, FaEyeSlash } from "react-icons/fa";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const password = form.password;
  const hasMinLength = password.length >= 8;
  const hasCapital = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isPasswordValid = hasMinLength && hasCapital && hasLowercase && hasNumber && hasSpecial;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isPasswordValid) {
      setError("Password does not meet the complexity requirements.");
      return;
    }

    setLoading(false);
    setLoading(true);

    try {
      const res = await registerUser(form);
      setSuccess(res.message || "Registration Successful. Please verify your email.");
      setTimeout(() => {
        navigate("/verify-email", { state: { email: form.email, otp_code: res.otp_code } });
      }, 1500);
    } catch (err: any) {
      const serverError = err.response?.data?.detail || err.response?.data?.message || err.message;
      setError(serverError || "Registration Failed. Please check network connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] flex justify-center items-center relative overflow-hidden page-enter">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />

      <form
        onSubmit={handleRegister}
        className="glass-panel-cyan p-8 rounded-2xl w-[450px] relative z-20 border border-cyan-500/25 shadow-2xl transition-all duration-300 hover:border-cyan-400/40"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-7">
          <div className="w-16 h-16 rounded-xl bg-cyan-500/15 flex items-center justify-center border border-cyan-500/30 glow-cyan mb-3">
            <FaShieldAlt className="text-3xl text-cyan-400" />
          </div>
          <h1 className="text-4xl text-cyan-400 font-bold text-center tracking-wider font-cyber glow-text-cyan">
            GUARDIAN<span className="text-white">X</span>
          </h1>
          <p className="text-center text-zinc-400 text-sm mt-1">CREATE SECURE USER ACCOUNT</p>
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

        <div className="space-y-4">
          <div>
            <label className="text-xs text-zinc-400 block mb-1 uppercase font-cyber">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="User Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-[#0e0e11] border border-zinc-800 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 text-white transition-all"
            />
          </div>

          <div>
            <label className="text-xs text-zinc-400 block mb-1 uppercase font-cyber">Username</label>
            <input
              type="text"
              name="username"
              placeholder="@codename"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-[#0e0e11] border border-zinc-800 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 text-white transition-all"
            />
          </div>

          <div>
            <label className="text-xs text-zinc-400 block mb-1 uppercase font-cyber">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="identity@domain.com"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-[#0e0e11] border border-zinc-800 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 text-white transition-all"
            />
          </div>

          <div>
            <label className="text-xs text-zinc-400 block mb-1 uppercase font-cyber">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••••••"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full p-3 pr-12 rounded-lg bg-[#0e0e11] border border-zinc-800 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 text-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-cyan-500/60 hover:text-cyan-400 transition-colors"
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>

            {/* Password Validation Checklist */}
            {password.length > 0 && (
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
        </div>

        <button
          type="submit"
          disabled={loading || (password.length > 0 && !isPasswordValid)}
          className="w-full mt-6 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-700/30 disabled:text-zinc-500 disabled:cursor-not-allowed text-black font-bold p-3 rounded-lg font-cyber tracking-widest text-sm transition-all duration-300 glow-cyan cursor-pointer"
        >
          {loading ? "INITIALIZING..." : "INITIALIZE ACCOUNT"}
        </button>

        <p className="text-center text-zinc-500 text-xs mt-6">
          Already a user?{" "}
          <Link to="/login" className="text-cyan-400 hover:underline font-cyber">
            Establish Session
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;