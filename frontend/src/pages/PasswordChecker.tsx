import { useState } from "react";
import { checkPassword, getCurrentUser } from "../services/auth";

function PasswordChecker() {
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(false);
  const MAX_PASSWORD_LENGTH = 128;

  const handleCheck = async () => {
    setError("");
    setResult(null);

    if (!password.trim()) {
      setError("Please enter a password first.");
      return;
    }

    if (password.length > MAX_PASSWORD_LENGTH) {
      setError("Password is too long. Please enter a shorter password.");
      return;
    }

    setScanning(true);

    try {
      const res = await checkPassword(password, getCurrentUser()?.id);
      if (res.status === "Error") {
        setError(res.message || "Failed to analyze password.");
      } else {
        setResult(res);
      }
    } catch (err) {
      console.log(err);
      setError("Unable to check password strength. Please try again.");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white p-14 page-enter">
      <h1 className="text-6xl font-bold text-cyan-400 font-cyber glow-text-cyan">
        Password Strength Checker
      </h1>

      <p className="text-zinc-400 mt-5 text-2xl font-cyber">
        Enter a password to analyze its strength.
      </p>

      <input
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (error) setError("");
        }}
        placeholder="Enter Password"
        className="w-full mt-10 bg-[#161616] border border-zinc-800 rounded-xl p-6 text-xl focus:border-cyan-500 outline-none transition-all"
      />

      <div className="flex justify-between mt-3 font-cyber">
        <label className="flex items-center gap-2 text-zinc-450 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
            className="rounded border-zinc-700 bg-zinc-800 text-cyan-500 focus:ring-cyan-500"
          />
          Show Password
        </label>

        <p
          className={`text-sm ${
            password.length > MAX_PASSWORD_LENGTH * 0.9
              ? "text-yellow-400"
              : "text-zinc-400"
          }`}
        >
          {password.length}/{MAX_PASSWORD_LENGTH} characters
        </p>
      </div>

      {password.length > MAX_PASSWORD_LENGTH && (
        <p className="text-red-400 text-sm mt-2 font-cyber">
          Password is too long. Please enter a shorter password.
        </p>
      )}

      {error && (
        <div className="mt-6 p-5 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 font-cyber text-lg flex items-center gap-2">
          <span>🚨</span> {error}
        </div>
      )}

      <button
        onClick={handleCheck}
        disabled={
          password.length === 0 ||
          password.length > MAX_PASSWORD_LENGTH ||
          scanning
        }
        className={`mt-8 font-bold font-cyber tracking-wider px-12 py-5 rounded-xl text-xl transition cursor-pointer ${
          password.length === 0 ||
          password.length > MAX_PASSWORD_LENGTH ||
          scanning
            ? "bg-zinc-800 cursor-not-allowed text-zinc-500 border border-transparent"
            : "bg-cyan-500 hover:bg-cyan-600 text-black glow-cyan"
        }`}
      >
        {scanning ? "ANALYZING..." : "Check Password"}
      </button>

      {result && (
        <div className="mt-10 bg-[#161616] p-8 rounded-xl">

          <h2 className="text-3xl font-bold text-cyan-400">
            Result
          </h2>

          <p className="mt-5 text-2xl">
            <strong>Strength:</strong> {result.strength}
          </p>

          <p className="mt-2 text-2xl">
            <strong>Score:</strong> {result.score}/100
          </p>

          <h3 className="mt-6 text-xl font-bold">
            Suggestions
          </h3>

          <ul className="list-disc ml-6 mt-3">
            {result.suggestions.length === 0 ? (
              <li>Excellent password!</li>
            ) : (
              result.suggestions.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))
            )}
          </ul>

        </div>
      )}

    </div>
  );
}

export default PasswordChecker;