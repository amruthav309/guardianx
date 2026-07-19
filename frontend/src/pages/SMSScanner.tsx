import { useState } from "react";
import {
  scanSMS,
  getCurrentUser,
} from "../services/auth";

function SMSScanner() {
  const [sms, setSms] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(false);
  const MAX_SMS_LENGTH = 1000;

  const handleScan = async () => {
    setError("");
    setResult(null);

    if (!sms.trim()) {
      setError("Please paste an SMS first.");
      return;
    }

    if (sms.length > MAX_SMS_LENGTH) {
      setError("SMS is too large to paste. Please enter a shorter message.");
      return;
    }

    setScanning(true);

    try {
      const user = getCurrentUser();
      const res = await scanSMS({
        user_id: user.id,
        sms: sms,
      });

      if (res.status === "Error") {
        setError(res.message || "Failed to analyze SMS content.");
      } else {
        setResult(res);
      }
    } catch (err) {
      console.log(err);
      setError("Unable to scan SMS. Please verify network status.");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white p-14 page-enter">
      <h1 className="text-6xl font-bold text-cyan-400 font-cyber glow-text-cyan">
        SMS Scanner
      </h1>

      <p className="text-zinc-400 mt-5 text-2xl font-cyber">
        Paste an SMS below to check whether it is phishing.
      </p>

      <textarea
        value={sms}
        onChange={(e) => {
          setSms(e.target.value);
          if (error) setError("");
        }}
        placeholder="Paste SMS here..."
        className="w-full h-[350px] mt-10 bg-[#161616] border border-zinc-800 rounded-xl p-8 text-xl focus:border-cyan-500 outline-none transition-all"
      />

      <div className="flex justify-between mt-2 font-cyber">
        <p
          className={`text-sm ${
            sms.length > MAX_SMS_LENGTH * 0.9
              ? "text-yellow-400"
              : "text-zinc-400"
          }`}
        >
          {sms.length}/{MAX_SMS_LENGTH} characters
        </p>

        {sms.length > MAX_SMS_LENGTH && (
          <p className="text-red-400 text-sm">
            SMS is too large to paste. Please enter a valid SMS message.
          </p>
        )}
      </div>

      {error && (
        <div className="mt-6 p-5 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 font-cyber text-lg flex items-center gap-2">
          <span>🚨</span> {error}
        </div>
      )}

      <button
        onClick={handleScan}
        disabled={
          sms.length === 0 ||
          sms.length > MAX_SMS_LENGTH ||
          scanning
        }
        className={`mt-10 font-bold font-cyber tracking-wider px-16 py-6 rounded-xl text-2xl transition cursor-pointer ${
          sms.length === 0 ||
          sms.length > MAX_SMS_LENGTH ||
          scanning
            ? "bg-zinc-800 cursor-not-allowed text-zinc-500 border border-transparent"
            : "bg-cyan-500 hover:bg-cyan-600 text-black glow-cyan"
        }`}
      >
        {scanning ? "SCANNING..." : "Scan SMS"}
      </button>

      {/* On-screen Results Display */}
      {result && (
        <div className="mt-12 bg-[#161616] border border-zinc-850 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold font-cyber text-cyan-400 mb-6 glow-text-cyan">
            Neural Analysis Results
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#09090B] border border-zinc-850 p-6 rounded-xl">
              <p className="text-xl font-cyber">
                <span className="text-zinc-400">Scan Verdict:</span>{" "}
                <span
                  className={`font-bold uppercase ${
                    result.status === "Phishing"
                      ? "text-red-500"
                      : result.status === "Suspicious"
                      ? "text-yellow-400"
                      : "text-green-400"
                  }`}
                >
                  {result.status}
                </span>
              </p>
              <p className="mt-4 text-xl font-cyber">
                <span className="text-zinc-400">Confidence Level:</span>{" "}
                <span className="font-bold text-white">{result.confidence}%</span>
              </p>
            </div>

            <div className="bg-[#09090B] border border-zinc-850 p-6 rounded-xl">
              <h3 className="text-xl font-bold font-cyber text-zinc-300 mb-4">
                Identified Risk Factors
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.matched_words && result.matched_words.length > 0 ? (
                  result.matched_words.map((word: string, idx: number) => (
                    <span
                      key={idx}
                      className="bg-red-500/15 border border-red-500/30 text-red-400 px-3 py-1 rounded-full text-sm font-cyber font-bold"
                    >
                      {word}
                    </span>
                  ))
                ) : (
                  <span className="text-green-400 font-cyber">
                    ✓ No threat patterns identified in text content.
                  </span>
                )}
              </div>
            </div>
          </div>

          {result.advisor && (
            <div className="mt-8 bg-[#09090B] border border-cyan-500/20 rounded-xl p-6">
              <h3 className="text-xl font-bold font-cyber text-cyan-400 mb-4 flex items-center gap-2">
                <span>🛡</span> AI Security Advisor Recommended Countermeasures
              </h3>
              <p className="text-zinc-300 text-lg leading-relaxed">{result.advisor}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SMSScanner;