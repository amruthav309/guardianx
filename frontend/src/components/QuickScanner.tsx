import { useState } from "react";
import { addNotification } from "../utils/notifications";
import {
  scanEmail,
  scanURL,
  scanSMS,
  checkPassword,
  uploadFile,
  downloadReport,
  getCurrentUser,
  getAnalytics,
  getHistory,
} from "../services/auth";
import { FaShieldAlt, FaEnvelope, FaGlobe, FaSms, FaKey, FaFolderOpen, FaRocket, FaFileDownload, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

interface QuickScannerProps {
  theme?: "cyan" | "red";
}

function QuickScanner({ theme = "cyan" }: QuickScannerProps) {
  const isRed = theme === "red";

  const [scanType, setScanType] = useState("email");
  const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [scanError, setScanError] = useState("");
  const [scanning, setScanning] = useState(false);


  // Unique max limits per scan type
  const MAX_LIMITS: Record<string, number> = {
    email: 3000,
    url: 2048,
    sms: 1000,
    password: 128,
  };
  const currentLimit = MAX_LIMITS[scanType] ?? 5000;

  const refreshDashboard = async () => {
    const user = getCurrentUser();

    if (!user) return;

    const analytics = await getAnalytics(user.id);
    const history = await getHistory();

    localStorage.setItem(
      "guardianx_dashboard",
      JSON.stringify({
        analytics,
        history,
      })
    );
  };

  const handleScan = async () => {
    setScanError("");

    try {
      let input = text;
      let res;

      if (selectedFile) {
        setScanning(true);
        res = await uploadFile(selectedFile, getCurrentUser()?.id);
        input = res.content;
      } else {
        if (!input.trim()) {
          setScanError("Please paste text or URL to analyze.");
          return;
        }

        if (text.length > currentLimit) {
          setScanError(`Input exceeds the ${currentLimit} character limit for ${scanType.toUpperCase()} scanning.`);
          return;
        }

        setScanning(true);

        const userId = getCurrentUser()?.id;

        switch (scanType) {
          case "email":
            res = await scanEmail({
              email: input,
              user_id: userId,
            });
            break;

          case "url":
            res = await scanURL({
              url: input,
              user_id: userId,
            });
            break;

          case "sms":
            res = await scanSMS({
              sms: input,
              user_id: userId,
            });
            break;

          case "password":
            res = await checkPassword(input, userId);
            break;

          default:
            return;
        }
      }

      if (res.status === "Error") {
        setScanError(res.message || "Scan failed. Please try again.");
        setResult(null);
        return;
      }

      setResult(res);

      await refreshDashboard();
      window.dispatchEvent(new Event("guardianx_scan_completed"));

      if (selectedFile) {
        if (res.status === "Phishing") {
          addNotification(
            "📄 Malicious File",
            "GuardianX detected phishing content in the uploaded file.",
            "danger"
          );
        } else if (res.status === "Suspicious") {
          addNotification(
            "📄 Suspicious File",
            "The uploaded file contains suspicious content.",
            "warning"
          );
        } else {
          addNotification(
            "📄 File Scanned",
            "The uploaded file appears to be clean.",
            "success"
          );
        }
      } else if (scanType === "email") {
        if (res.status === "Phishing") {
          addNotification(
            "🚨 Phishing Email",
            "GuardianX detected a phishing email.",
            "danger"
          );
        } else if (res.status === "Suspicious") {
          addNotification(
            "⚠️ Suspicious Email",
            "GuardianX detected a suspicious email.",
            "warning"
          );
        } else {
          addNotification(
            "✅ Safe Email",
            "Email is safe.",
            "success"
          );
        }
      } else if (scanType === "url") {
        if (res.status === "Phishing") {
          addNotification(
            "🌐 Malicious URL",
            "GuardianX blocked a malicious URL.",
            "danger"
          );
        } else if (res.status === "Suspicious") {
          addNotification(
            "⚠️ Suspicious URL",
            "GuardianX detected a suspicious URL.",
            "warning"
          );
        } else {
          addNotification(
            "✅ Safe URL",
            "URL is safe.",
            "success"
          );
        }
      } else if (scanType === "sms") {
        if (res.status === "Phishing") {
          addNotification(
            "📱 Suspicious SMS",
            "GuardianX detected a phishing SMS.",
            "danger"
          );
        } else if (res.status === "Suspicious") {
          addNotification(
            "⚠️ Suspicious SMS",
            "GuardianX detected a suspicious SMS.",
            "warning"
          );
        } else {
          addNotification(
            "✅ Safe SMS",
            "SMS is safe.",
            "success"
          );
        }
      } else if (scanType === "password") {
        addNotification(
          "🔑 Password Checked",
          `Strength: ${res.strength}`,
          "info"
        );
      }

    } catch (error) {
      console.log(error);
      setScanError("Unable to scan. Please check system connection.");
    } finally {
      setScanning(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!result) return;
    try {
      await downloadReport(result);
    } catch (error) {
      console.log(error);
      setScanError("Unable to download report. Please try again.");
    }
  };

  return (
    <div className={isRed ? "bg-[#0f0609]/95 rounded-2xl p-6 sm:p-8 border border-red-600/25 shadow-2xl relative overflow-hidden" : "bg-[#111927]/90 rounded-2xl p-6 sm:p-8 border border-sky-500/20 shadow-2xl relative overflow-hidden"}>

      {/* Laser line overlay when scanning */}
      {scanning && <div className="scanner-line" />}

      <div className={isRed ? "flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-red-600/15 pb-5" : "flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sky-500/15 pb-5"}>
        <div>
          <h2 className={isRed ? "text-2xl sm:text-3xl font-bold font-serif-header text-red-400 flex items-center gap-2" : "text-2xl sm:text-3xl font-bold font-serif-header text-slate-100 flex items-center gap-2"}>
            <span>AI Neural Security Control Panel</span>
          </h2>
          <p className={isRed ? "text-zinc-500 text-xs mt-1" : "text-sky-400/60 text-xs mt-1"}>
            Select a target vector or upload a document for real-time heuristic threat detection.
          </p>
        </div>

        <span className={isRed ? "text-xs font-cyber px-3 py-1 rounded-full bg-red-600/15 border border-red-600/30 text-red-400 w-fit" : "text-xs font-cyber px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 w-fit"}>
          Live AI Engine Active
        </span>
      </div>

      {/* Vector Selector Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {[
          { key: "email", icon: <FaEnvelope />, title: "Email Phishing", desc: "Text & Header Analysis" },
          { key: "url", icon: <FaGlobe />, title: "Malicious URL", desc: "Domain & Link Safety" },
          { key: "sms", icon: <FaSms />, title: "Smishing SMS", desc: "Text Threat Detection" },
          { key: "password", icon: <FaKey />, title: "Password Strength", desc: "Entropy & Breach Check" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => {
              if (scanType !== item.key) {
                setScanType(item.key);
                setText("");
                setResult(null);
                setSelectedFile(null);
                setScanError("");
              }
            }}
            className={`rounded-2xl p-4 border text-left transition-all duration-300 cursor-pointer ${
              scanType === item.key
                ? isRed
                  ? "border-red-500 bg-gradient-to-r from-red-700 to-red-600 text-white shadow-lg shadow-red-600/25 font-bold"
                  : "border-sky-400 bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25 font-bold"
                : isRed
                  ? "border-red-600/15 bg-[#0a0407] text-zinc-300 hover:bg-red-950/30 hover:border-red-600/30"
                  : "border-sky-500/20 bg-[#080e18] text-slate-300 hover:bg-sky-500/10 hover:border-sky-500/40"
            }`}
          >
            <div className={`text-xl mb-2 ${scanType === item.key ? "text-white" : isRed ? "text-red-400" : "text-sky-400"}`}>
              {item.icon}
            </div>
            <h3 className={`text-sm font-bold font-cyber ${scanType === item.key ? "text-white" : "text-zinc-100"}`}>
              {item.title}
            </h3>
            <p className={`text-[10px] font-sans mt-0.5 ${scanType === item.key ? (isRed ? "text-red-100" : "text-sky-100") : isRed ? "text-zinc-500" : "text-sky-400/60"}`}>
              {item.desc}
            </p>
          </button>
        ))}
      </div>

      {/* Input Textarea Container */}
      <div className="mt-6">
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (scanError) setScanError("");
          }}
          placeholder={`Paste your target ${scanType.toUpperCase()} content here for GuardianX neural threat inspection...`}
          className={`w-full h-44 bg-[#080e18] border rounded-2xl p-4 text-sm font-mono text-slate-100 outline-none transition-all ${
            !selectedFile && text.length > currentLimit
              ? "border-rose-500/50 focus:border-rose-500"
              : isRed
                ? "border-red-600/20 focus:border-red-500"
                : "border-sky-500/20 focus:border-cyan-400"
          }`}
        />

        {/* Character counter */}
        {!selectedFile && (
          <div className="flex justify-between mt-2 font-cyber text-xs">
            <p className={text.length > currentLimit * 0.9 ? "text-amber-400" : isRed ? "text-red-400/60" : "text-sky-400/60"}>
              {text.length}/{currentLimit} characters
            </p>
            {text.length > currentLimit && (
              <p className="text-rose-400">
                Input exceeds maximum limit ({currentLimit} chars)
              </p>
            )}
          </div>
        )}
      </div>

      {/* Error message box */}
      {scanError && (
        <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/25 rounded-xl text-rose-400 font-cyber text-xs flex items-center gap-2">
          <FaExclamationTriangle /> {scanError}
        </div>
      )}

      {/* File Upload Drop Zone */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <label className={isRed ? "text-sm font-cyber font-bold text-red-400 flex items-center gap-1.5" : "text-sm font-cyber font-bold text-sky-400 flex items-center gap-1.5"}>
            <FaFolderOpen /> <span>Upload Document File for Inspection</span>
          </label>
          <span className="text-[10px] text-zinc-400 font-mono">Supports TXT, PDF, DOCX, EML, PNG, JPG</span>
        </div>

        <label
          htmlFor="fileUpload"
          className={isRed ? "flex flex-col justify-center items-center py-6 border-2 border-dashed border-red-600/30 hover:border-red-500/60 bg-[#0a0407]/70 rounded-2xl cursor-pointer hover:bg-red-950/20 transition-all" : "flex flex-col justify-center items-center py-6 border-2 border-dashed border-sky-500/30 hover:border-sky-400/60 bg-[#080e18]/70 rounded-2xl cursor-pointer hover:bg-sky-500/10 transition-all"}
        >
          <div className={isRed ? "text-3xl text-red-400 mb-2" : "text-3xl text-sky-400 mb-2"}>
            📂
          </div>
          <p className="text-xs font-cyber text-slate-200">
            Click or drag file to analyze
          </p>
        </label>

        <input
          id="fileUpload"
          type="file"
          className="hidden"
          accept=".txt,.pdf,.docx,.eml,.png,.jpg,.jpeg"
          onChange={(e) => {
            if (e.target.files?.length) {
              setSelectedFile(e.target.files[0]);
            }
          }}
        />

        {selectedFile && (
          <div className={isRed ? "bg-[#0a0407] border border-red-600/30 rounded-xl mt-3 p-3.5 flex justify-between items-center text-xs" : "bg-[#080e18] border border-sky-500/30 rounded-xl mt-3 p-3.5 flex justify-between items-center text-xs"}>
            <div className="flex items-center gap-2">
              <span className={isRed ? "text-red-400" : "text-sky-400"}>✔ File Selected:</span>
              <span className="font-mono text-zinc-200">{selectedFile.name}</span>
              <span className="text-zinc-400 font-mono">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-rose-400 text-xs font-cyber hover:underline cursor-pointer"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {/* Execute Scan Action Button */}
      <button
        onClick={handleScan}
        disabled={scanning || (!selectedFile && text.length > currentLimit)}
        className={`w-full mt-6 font-bold font-cyber tracking-wider py-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
          scanning || (!selectedFile && text.length > currentLimit)
            ? isRed
              ? "bg-[#110709] cursor-not-allowed text-red-400/40 border border-red-600/10"
              : "bg-[#0a121e] cursor-not-allowed text-sky-400/40 border border-sky-500/10"
            : isRed
              ? "bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white shadow-lg shadow-red-600/25 hover:scale-[1.01]"
              : "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-lg shadow-sky-500/25 hover:scale-[1.01]"
        }`}
      >
        <FaRocket size={14} />
        <span>{scanning ? "EXECUTION IN PROGRESS..." : "Execute GuardianX AI Neural Scan"}</span>
      </button>


      {/* Forensic Result Report Card */}
      {result && (() => {
        const userLevel = getCurrentUser()?.security_level || "Standard";

        let levelTheme = {
          border: "border-sky-500/30 bg-[#111927]/95",
          bannerBg: "bg-sky-500/10 border-sky-500/30 text-sky-400",
          bannerText: "Standard Guard Active — Secure Sandbox Mode",
          glow: "shadow-[0_0_20px_rgba(56,189,248,0.2)]",
        };

        if (userLevel === "Enhanced") {
          levelTheme = {
            border: "border-amber-500/30 bg-[#0e0c0a]/95",
            bannerBg: "bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse",
            bannerText: "Enhanced Heuristic Analysis Shield Active",
            glow: "shadow-[0_0_20px_rgba(245,158,11,0.2)]",
          };
        } else if (userLevel === "Lockdown") {
          levelTheme = {
            border: "border-rose-500/40 bg-[#120808]/95",
            bannerBg: "bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse",
            bannerText: "⚡ PROTOCOL LOCKDOWN ENFORCED — INTERCEPT ACTIVE",
            glow: "shadow-[0_0_25px_rgba(244,63,94,0.3)]",
          };
        }

        return (
          <div className={`mt-8 rounded-2xl p-6 border transition-all duration-300 ${levelTheme.border} ${levelTheme.glow}`}>
            <div className={`flex items-center gap-2 border px-4 py-2.5 rounded-xl mb-6 text-xs font-cyber font-bold tracking-wider ${levelTheme.bannerBg}`}>
              <span>{levelTheme.bannerText}</span>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-sky-500/15">
              <h3 className="text-xl font-bold font-serif-header text-slate-100 flex items-center gap-2">
                <span>Forensic Intelligence Matrix</span>
                <span className="text-[10px] text-sky-400/60 font-mono">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
              </h3>

              {"status" in result && (
                <div className="flex gap-2">
                  {userLevel === "Lockdown" && (result.status === "Phishing" || result.status === "Suspicious") && (
                    <span className="text-[9px] font-cyber px-2 py-1 rounded bg-rose-500 text-white font-bold animate-pulse">
                      THREAT INTERCEPTED
                    </span>
                  )}
                  <span className={`text-[10px] font-cyber font-bold uppercase tracking-wider px-3 py-1 rounded border ${
                    result.status === "Phishing" ? "bg-rose-500/15 border-rose-500/40 text-rose-400" :
                    result.status === "Suspicious" ? "bg-amber-500/15 border-amber-500/40 text-amber-400" :
                    "bg-sky-500/15 border-sky-500/40 text-sky-400"
                  }`}>
                    {result.status}
                  </span>
                </div>
              )}
            </div>

            {"status" in result && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#0a0407] border border-red-600/15 rounded-xl p-4">
                    <p className="text-[10px] text-zinc-500 uppercase font-cyber">Verdict Severity</p>
                    <p className={`text-xl font-bold font-cyber mt-1 uppercase ${
                      result.status === "Phishing" ? "text-rose-400" :
                      result.status === "Suspicious" ? "text-amber-400" : "text-emerald-400"
                    }`}>
                      {result.status === "Phishing" ? "Critical Risk" : result.status === "Suspicious" ? "Medium Risk" : "Clean / Verified Safe"}
                    </p>
                  </div>

                  <div className="bg-[#0a0407] border border-red-600/15 rounded-xl p-4">
                    <p className="text-[10px] text-zinc-500 uppercase font-cyber">AI Model Confidence</p>
                    <p className="text-xl font-bold font-cyber text-red-400 mt-1">{result.confidence}%</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs uppercase font-cyber text-sky-300 mb-3 tracking-wider">Identified Risk Indicators</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.matched_words && result.matched_words.length > 0 ? (
                      result.matched_words.map((word: string, index: number) => {
                        const isRedacted = userLevel === "Lockdown" && result.status === "Phishing";
                        return (
                          <span
                            key={index}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border ${
                              isRedacted 
                                ? "bg-rose-950/30 border-rose-500/40 text-rose-400 cursor-not-allowed select-none blur-[2px] hover:blur-none transition-all duration-200" 
                                : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                            }`}
                          >
                            {isRedacted ? `[REDACTED: ${word.toUpperCase()}]` : word}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-xs text-sky-400 font-cyber flex items-center gap-1">
                        <FaCheckCircle /> Zero malicious indicators isolated in analyzed payload.
                      </span>
                    )}
                  </div>
                </div>

                {result.advisor && (
                  <div className="mt-6 bg-[#0a0407] border border-red-600/20 rounded-xl p-5">
                    <h4 className="text-sm font-bold font-cyber text-red-400 flex items-center gap-2 mb-3">
                      <FaShieldAlt /> AI Security Advisor Recommended Countermeasures
                    </h4>

                    <div className="space-y-4">
                      {result.advisor.reason && (
                        <div>
                          <p className="text-[10px] text-zinc-500 uppercase font-cyber">Assessment Basis</p>
                          <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 mt-1.5">
                            {result.advisor.reason.map((reason: string, index: number) => (
                              <li key={index}>{reason}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {result.advisor.recommendation && (
                        <div>
                          <p className="text-[10px] text-sky-400/60 uppercase font-cyber">Action Plan</p>
                          <ul className="list-disc list-inside text-xs text-sky-400 space-y-1 mt-1.5">
                            {result.advisor.recommendation.map((item: string, index: number) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                  <div className="pt-4 border-t border-red-600/15">
                  <button
                    onClick={handleDownloadReport}
                    className="flex items-center gap-2 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold font-cyber text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-red-600/25 hover:scale-[1.02] transition-all cursor-pointer"
                  >
                    <FaFileDownload /> Export Forensic PDF Report
                  </button>
                </div>
              </div>
            )}

            {"strength" in result && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#0a0407] border border-red-600/15 rounded-xl p-4">
                    <p className="text-[10px] text-zinc-500 uppercase font-cyber">Entropy Rating</p>
                    <p className={`text-xl font-bold font-cyber mt-1 uppercase ${
                      result.strength === "STRONG" ? "text-emerald-400" :
                      result.strength === "MEDIUM" ? "text-amber-400" : "text-rose-500"
                    }`}>
                      {result.strength}
                    </p>
                  </div>

                  <div className="bg-[#0a0407] border border-red-600/15 rounded-xl p-4">
                    <p className="text-[10px] text-zinc-500 uppercase font-cyber">Password Security Score</p>
                    <p className="text-xl font-bold font-cyber text-red-400 mt-1">{result.score}/100</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

    </div>

  );
}

export default QuickScanner;