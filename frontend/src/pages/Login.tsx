import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { loginUser } from "../services/auth";
import { FaShieldAlt, FaEye, FaEyeSlash, FaUserPlus, FaLock } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");

  useEffect(() => {
    // If not adding a new account, auto-redirect if already logged in
    if (mode !== "add") {
      const remembered = localStorage.getItem("rememberMe");
      const user = localStorage.getItem("guardianx_user");

      if (remembered === "true" && user) {
        navigate("/dashboard");
      }
    }
  }, [navigate, mode]);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(
    localStorage.getItem("rememberMe") === "true"
  );
  const [isScanning, setIsScanning] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsScanning(true);

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
        };

        // Save complete logged-in user as current active session
        localStorage.setItem("guardianx_user", JSON.stringify(userData));
        localStorage.setItem("userEmail", res.email);

        // Update list of all logged-in accounts
        const accounts = JSON.parse(
          localStorage.getItem("guardianx_accounts") || "[]"
        );

        const existsIdx = accounts.findIndex(
          (acc: any) => acc.email === res.email
        );

        if (existsIdx > -1) {
          // Update details
          accounts[existsIdx] = userData;
        } else {
          // Append account
          accounts.push(userData);
        }

        localStorage.setItem("guardianx_accounts", JSON.stringify(accounts));

        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberMe");
        }

        // Trigger scan line swipe animation before entering dashboard
        setTimeout(() => {
          setIsScanning(false);
          if (mode === "add") {
            navigate("/switch-account");
          } else {
            navigate("/loading");
          }
        }, 1200);

      } else {
        setIsScanning(false);
        setLoginError(res.message || "Login failed.");
      }

    } catch (error: any) {
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
    <div className="min-h-screen bg-[#070709] flex justify-center items-center relative overflow-hidden page-enter">
      {/* Cybersecurity Laser Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      
      {/* Decorative neon ambient glow spots */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"></div>

      <form
        onSubmit={handleLogin}
        className="glass-panel-cyan p-8 rounded-2xl w-[450px] relative z-20 border border-cyan-500/25 shadow-2xl transition-all duration-300 hover:border-cyan-400/40"
      >
        {isScanning && <div className="scanner-line"></div>}

        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-xl bg-cyan-500/15 flex items-center justify-center border border-cyan-500/30 glow-cyan mb-3">
            <FaShieldAlt className="text-3xl text-cyan-400" />
          </div>
          
          <h1 className="text-4xl text-cyan-400 font-bold text-center tracking-wider font-cyber glow-text-cyan">
            GUARDIAN<span className="text-white">X</span>
          </h1>

          <p className="text-center text-zinc-400 text-sm mt-1">
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

        <div className="space-y-4">
          <div>
            <label className="text-xs text-zinc-400 block mb-1 uppercase font-cyber">Email Address</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="identity@domain.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full p-3 pl-4 rounded-lg bg-[#0e0e11] border border-zinc-800 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 text-white transition-all"
              />
            </div>
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
                className="w-full p-3 pl-4 pr-12 rounded-lg bg-[#0e0e11] border border-zinc-800 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 text-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-cyan-500/60 hover:text-cyan-400 transition-colors"
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

        {loginError && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-cyber">
            ⚠ {loginError}
          </div>
        )}

        <button
          type="submit"
          disabled={isScanning}
          className="w-full mt-4 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-700/50 text-black font-bold p-3 rounded-lg font-cyber tracking-widest text-sm transition-all duration-300 glow-cyan flex items-center justify-center gap-2 cursor-pointer"
        >
          <FaLock className="text-xs" />
          {isScanning ? "AUTHORIZING..." : mode === "add" ? "ADD ACCOUNT" : "ESTABLISH SESSION"}
        </button>

        {mode !== "add" ? (
          <p className="text-center text-zinc-500 text-xs mt-6">
            New agent?
            <Link to="/register" className="text-cyan-400 hover:underline ml-1 font-cyber">
              Initialize Account
            </Link>
          </p>
        ) : (
          <p className="text-center text-zinc-500 text-xs mt-6">
            <button
              type="button"
              onClick={() => navigate("/switch-account")}
              className="text-cyan-400 hover:underline font-cyber"
            >
              Back to Switcher
            </button>
          </p>
        )}
      </form>
    </div>
  );
}

export default Login;