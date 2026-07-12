import { useState } from "react";
import { checkPassword } from "../services/auth";

function PasswordChecker() {
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleCheck = async () => {
    if (!password.trim()) {
      alert("Enter a password first.");
      return;
    }

    try {
      const res = await checkPassword(password);
      setResult(res);
    } catch (err) {
      console.log(err);
      alert("Unable to check password.");
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white p-14">

      <h1 className="text-6xl font-bold text-cyan-400">
        Password Strength Checker
      </h1>

      <p className="text-zinc-400 mt-5 text-2xl">
        Enter a password to analyze its strength.
      </p>

      <input
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter Password"
        className="w-full mt-10 bg-[#161616] rounded-xl p-6 text-xl"
      />

      <div className="mt-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          Show Password
        </label>
      </div>

      <button
        onClick={handleCheck}
        className="mt-8 bg-cyan-500 hover:bg-cyan-600 text-black font-bold px-12 py-5 rounded-xl text-xl"
      >
        Check Password
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