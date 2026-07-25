import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { loginUser, default as API } from "../services/auth";
import { FaShieldAlt, FaEye, FaEyeSlash, FaUserPlus, FaLock, FaCheckCircle, FaUserShield } from "react-icons/fa";

// Helper to encode/decode remembered credentials
const getSavedCredentials = () => {
  try {
    const raw = localStorage.getItem("guardianx_saved_credentials");
    if (!raw) return null;
    return JSON.parse(atob(raw));
  } catch {
    return null;
  }
};

const saveCredentials = (userId: number, email: string, password: string) => {
  try {
    const payload = JSON.stringify({ userId, email, password });
    localStorage.setItem("guardianx_saved_credentials", btoa(payload));
    localStorage.setItem("rememberMe", "true");
  } catch {}
};

const clearSavedCredentials = () => {
  localStorage.removeItem("guardianx_saved_credentials");
  localStorage.removeItem("rememberMe");
};

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");

  const savedCreds = getSavedCredentials();
  const [rememberMe, setRememberMe] = useState(
    localStorage.getItem("rememberMe") === "true" || !!savedCreds
  );

  const [form, setForm] = useState({
    email: savedCreds?.email || localStorage.getItem("remembered_email") || "",
    password: savedCreds?.password || "",
  });

  useEffect(() => {
    if (mode !== "add" && mode !== "user" && mode !== "signin") {
      const user = localStorage.getItem("guardianx_user");
      if (rememberMe && user) {
        navigate("/dashboard");
        return;
      }
    }

    if (savedCreds && mode !== "add" && mode !== "user" && mode !== "signin") {
      setForm({
        email: savedCreds.email,
        password: savedCreds.password,
      });
      setRememberMe(true);
    }
  }, [navigate, mode]);

  const [showPassword, setShowPassword] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [loginError, setLoginError] = useState("");

  const scanStatusMessages = [
    "ENCRYPTING BIOMETRIC HASH...",
    "VERIFYING NEURAL SECURITY TOKEN...",
    "AUTHENTICATING ACCESS CLEARANCE...",
    "ACCESS GRANTED — DOCKING SESSION..."
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const [deletedNotice, setDeletedNotice] = useState<string | null>(null);

  useEffect(() => {
    try {
      const rawNotice = localStorage.getItem("guardianx_deleted_account_notice");
      if (rawNotice) {
        const parsed = JSON.parse(rawNotice);
        setDeletedNotice(`⚠️ SYSTEM NOTICE: User account for ${parsed.name} (${parsed.email}) was deleted by Super-Admin on ${parsed.timestamp}.`);
      }
    } catch {}
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    // Check if account was deleted by admin
    try {
      const deletedList = JSON.parse(localStorage.getItem("guardianx_deleted_users") || "[]");
      if (deletedList.includes(form.email.trim().toLowerCase())) {
        setLoginError(`⚠️ ACCOUNT DELETED: Your account (${form.email}) was deleted by an administrator. Access is disabled.`);
        return;
      }
    } catch {}

    setIsScanning(true);
    setScanStep(0);

    const stepInterval = setInterval(() => {
      setScanStep((prev) => {
        if (prev < 3) return prev + 1;
        clearInterval(stepInterval);
        return 3;
      });
    }, 350);

    try {
      const res = await loginUser(form);

      if (res.message === "Login Successful") {
        const userData = {
          id: res.id,
          name: res.name,
          username: res.username,
          email: res.email,
          login_count: res.login_count,
          last_login: res.last_login,
          account_status: res.account_status,
          profile_pic: res.profile_pic || "",
          security_level: res.security_level || "Standard",
          role: "USER",
        };

        localStorage.setItem("guardianx_user", JSON.stringify(userData));

        const accounts = JSON.parse(
          localStorage.getItem("guardianx_accounts") || "[]"
        );
        const existsIdx = accounts.findIndex(
          (acc: any) => acc.email === res.email
        );
        if (existsIdx > -1) {
          accounts[existsIdx] = userData;
        } else {
          accounts.push(userData);
        }
        localStorage.setItem("guardianx_accounts", JSON.stringify(accounts));

        if (rememberMe) {
          saveCredentials(res.id, form.email, form.password);
        } else {
          clearSavedCredentials();
        }

        // Post login audit log to admin monitoring endpoint
        try {
          await API.post("/admin/audit-logs", {
            user_id: res.id,
            email: res.email,
            event_type: "LOGIN",
            status: "SUCCESS"
          });
        } catch {}

        setTimeout(() => {
          clearInterval(stepInterval);
          setIsScanning(false);
          if (mode === "add") {
            navigate("/dashboard");
          } else {
            navigate("/loading");
          }
        }, 1500);

      } else {
        clearInterval(stepInterval);
        setIsScanning(false);
        setLoginError(res.message || "Login failed.");
      }

    } catch (error: any) {
      clearInterval(stepInterval);
      setIsScanning(false);
      console.error(error);
      if (error.response?.data?.detail) {
        setLoginError(error.response.data.detail);
      } else {
        setLoginError("Login Failed. Please check your credentials.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] flex justify-center items-center relative overflow-hidden page-enter px-4 sm:px-0">
      {/* Cybersecurity Laser Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293712_1px,transparent_1px),linear-gradient(to_bottom,#1f293712_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]"></div>
      
      {/* Ambient background glows */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl"
      />

      <motion.form
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        onSubmit={handleLogin}
        className="glass-panel-cyan p-8 rounded-2xl w-full max-w-[450px] relative z-20 border border-cyan-500/30 shadow-[0_0_35px_rgba(6,182,212,0.15)] transition-all duration-300 hover:border-cyan-400/50"
      >
        {/* HUD Corner Brackets */}
        <div className="hud-corner-tl" />
        <div className="hud-corner-tr" />
        <div className="hud-corner-bl" />
        <div className="hud-corner-br" />

        {/* Laser Sweep when scanning */}
        {isScanning && <div className="auth-laser-beam" />}

        <div className="flex flex-col items-center mb-6">
          {/* Revolving Holographic Shield Ring */}
          <div className="relative mb-3 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute w-20 h-20 rounded-full border border-dashed border-cyan-400/40"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute w-24 h-24 rounded-full border border-dotted border-violet-400/30"
            />
            <div className="w-16 h-16 rounded-xl bg-cyan-500/15 flex items-center justify-center border border-cyan-500/30 glow-cyan relative z-10">
              <FaShieldAlt className="text-3xl text-cyan-400" />
            </div>
          </div>
          
          <h1 className="text-4xl text-cyan-400 font-bold text-center tracking-wider font-cyber glow-text-cyan">
            GUARDIAN<span className="text-white">X</span>
          </h1>

          <p className="text-center text-zinc-400 text-xs mt-1 font-cyber tracking-widest uppercase">
            {mode === "add" ? "ADD SECONDARY ACCOUNT" : "AI POWERED CYBER SECURITY PLATFORM"}
          </p>
        </div>

        {mode === "add" && (
          <div className="mb-6 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg flex items-center gap-3">
            <FaUserPlus className="text-cyan-400" />
            <p className="text-xs text-zinc-300">
              You are adding another account. This will keep your currently logged-in accounts active.
            </p>
          </div>
        )}

        {/* Live Telemetry Progress when scanning */}
        {isScanning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-5 p-3 bg-[#0a0a0f] border border-cyan-500/30 rounded-xl font-mono text-xs text-cyan-400 space-y-1.5 shadow-[inset_0_0_15px_rgba(6,182,212,0.1)]"
          >
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-1.5 text-[10px] uppercase tracking-wider text-zinc-400 font-cyber">
              <span>SECURITY AUTH TELEMETRY</span>
              <span className="animate-pulse text-cyan-400">● LIVE</span>
            </div>
            <div className="flex items-center gap-2">
              {scanStep === 3 ? (
                <FaCheckCircle className="text-emerald-400 text-sm" />
              ) : (
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              )}
              <span className={scanStep === 3 ? "text-emerald-400 font-bold" : "text-cyan-300"}>
                {scanStatusMessages[scanStep]}
              </span>
            </div>
          </motion.div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-xs text-zinc-400 block mb-1 uppercase font-cyber tracking-wider">Email Address</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="identity@domain.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full p-3 pl-4 rounded-lg bg-[#0e0e11] border border-zinc-800 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 text-white transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-zinc-400 block mb-1 uppercase font-cyber tracking-wider">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••••••"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full p-3 pl-4 pr-12 rounded-lg bg-[#0e0e11] border border-zinc-800 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 text-white transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-cyan-500/60 hover:text-cyan-400 transition-colors cursor-pointer"
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-5">
          <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded bg-[#0e0e11] border-zinc-800 text-cyan-500 focus:ring-0 cursor-pointer"
            />
            Remember Me
          </label>

          <Link
            to="/forgot-password"
            className="text-cyan-400 text-xs hover:underline font-cyber"
          >
            Forgot Password?
          </Link>
        </div>

        {deletedNotice && (
          <div className="mt-4 p-3 bg-red-600/15 border border-red-500/30 rounded-lg text-red-400 text-xs font-cyber flex items-center justify-between gap-2">
            <span>{deletedNotice}</span>
            <button type="button" onClick={() => { setDeletedNotice(null); localStorage.removeItem("guardianx_deleted_account_notice"); }} className="text-zinc-400 hover:text-white text-xs">✕</button>
          </div>
        )}

        {loginError && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-cyber flex items-center gap-2">
            ⚠ {loginError}
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isScanning}
          className="w-full mt-5 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-700/50 text-black font-bold p-3.5 rounded-xl font-cyber tracking-widest text-sm transition-all duration-300 glow-cyan flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.3)]"
        >
          <FaLock className="text-xs" />
          {isScanning ? "AUTHORIZING SESSION..." : mode === "add" ? "ADD ACCOUNT" : "ESTABLISH SESSION"}
        </motion.button>

        {mode !== "add" ? (
          <div className="flex flex-col gap-3 mt-6">
            <p className="text-center text-zinc-500 text-xs">
              New user?
              <Link to="/register" className="text-cyan-400 hover:underline ml-1 font-cyber font-bold">
                Initialize Account
              </Link>
            </p>
            <div className="pt-2 border-t border-zinc-800/80">
              <Link
                to="/admin/login"
                className="w-full py-2.5 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-cyber text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
              >
                <FaUserShield size={14} />
                Access Admin Login Portal →
              </Link>
            </div>
          </div>
        ) : (
          <p className="text-center text-zinc-500 text-xs mt-6">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="text-cyan-400 hover:underline font-cyber cursor-pointer"
            >
              Back to Dashboard
            </button>
          </p>
        )}
      </motion.form>
    </div>
  );
}

export default Login;