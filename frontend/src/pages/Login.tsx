import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth";

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
  const remembered = localStorage.getItem("rememberMe");
  const user = localStorage.getItem("guardianx_user");

  if (remembered === "true" && user) {
    navigate("/dashboard");
  }
}, [navigate]);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

 const [showPassword, setShowPassword] = useState(false);

const [rememberMe, setRememberMe] = useState(
  localStorage.getItem("rememberMe") === "true"
);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  try {

    const res = await loginUser(form);

    if (res.message === "Login Successful") {

      // Save complete logged-in user
      localStorage.setItem(
        "guardianx_user",
        JSON.stringify({
          id: res.id,
          name: res.name,
          username: res.username,
          email: res.email,
          login_count: res.login_count,
          last_login: res.last_login,
          account_status: res.account_status,
        })
      );

      const accounts = JSON.parse(
  localStorage.getItem("guardianx_accounts") || "[]"
);

const exists = accounts.find(
  (acc: any) => acc.email === res.email
);

if (!exists) {
  accounts.push({
    id: res.id,
    name: res.name,
    username: res.username,
    email: res.email,
    login_count: res.login_count,
    last_login: res.last_login,
    account_status: res.account_status,
  });

  localStorage.setItem(
    "guardianx_accounts",
    JSON.stringify(accounts)
  );
}

      localStorage.setItem("userEmail", res.email);

      if (rememberMe) {
  localStorage.setItem("rememberMe", "true");
} else {
  localStorage.removeItem("rememberMe");
}

      // Keep email for compatibility
      localStorage.setItem("userEmail", res.email);

      navigate("/loading");

    } else {

      alert(res.message);

    }

  } catch (error: any) {

    console.error(error);

    if (error.response?.data?.detail) {
      alert(error.response.data.detail);
    } else {
      alert("Login Failed");
    }

  }
};

  return (
    <div className="min-h-screen bg-[#09090B] flex justify-center items-center">

      <form
        onSubmit={handleLogin}
        className="bg-[#161616] border border-cyan-500/20 shadow-xl rounded-2xl p-8 w-[430px]"
      >

        <h1 className="text-5xl text-cyan-400 font-bold text-center">
          GuardianX
        </h1>

        <p className="text-center text-zinc-400 mt-3 mb-8">
          AI Powered Cyber Security Platform
        </p>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg mb-5 bg-[#202020] border border-zinc-700 outline-none focus:border-cyan-400"
        />

        <div className="relative">

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-[#202020] border border-zinc-700 outline-none focus:border-cyan-400"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-cyan-400"
          >
            {showPassword ? "Hide" : "Show"}
          </button>

        </div>

        <div className="flex justify-between items-center mt-4">

          <label className="flex items-center gap-2 text-sm text-zinc-400">

            <input
  type="checkbox"
  checked={rememberMe}
  onChange={(e) => setRememberMe(e.target.checked)}
/>

Remember Me
          </label>

          <Link
            to="/forgot-password"
            className="text-cyan-400 text-sm hover:underline"
          >
            Forgot Password?
          </Link>

        </div>

        <button
          type="submit"
          className="w-full mt-8 bg-cyan-500 hover:bg-cyan-400 text-black font-bold p-3 rounded-lg transition"
        >
          Sign In
        </button>

        <p className="text-center text-zinc-400 mt-6">
          Don't have an account?

          <Link
            to="/register"
            className="text-cyan-400 ml-2"
          >
            Register
          </Link>

        </p>

      </form>

    </div>
  );
}

export default Login;