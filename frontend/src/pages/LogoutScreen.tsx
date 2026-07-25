import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import API from "../services/auth";

function LogoutScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [username, setUsername] = useState("User");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Canvas for Horizontal Streaming Light Rays (Matching Image Background)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const lines = Array.from({ length: 65 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: 50 + Math.random() * 100,
      speed: 2.5 + Math.random() * 5.5,
      direction: Math.random() > 0.25 ? 1 : -1,
      alpha: 0.2 + Math.random() * 0.7,
    }));

    const render = () => {
      ctx.fillStyle = "rgba(2, 8, 31, 0.4)";
      ctx.fillRect(0, 0, width, height);

      lines.forEach((l) => {
        l.x += l.speed * l.direction;

        ctx.beginPath();
        ctx.moveTo(l.x, l.y);
        ctx.lineTo(l.x - l.length * l.direction, l.y);
        ctx.strokeStyle = `rgba(56, 189, 248, ${l.alpha})`;
        ctx.lineWidth = 1.6;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(l.x, l.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${l.alpha + 0.2})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#00f0ff";
        ctx.fill();
        ctx.shadowBlur = 0;

        if (l.direction === 1 && l.x > width + l.length) {
          l.x = -l.length;
          l.y = Math.random() * height;
        } else if (l.direction === -1 && l.x < -l.length) {
          l.x = width + l.length;
          l.y = Math.random() * height;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    // Multi-stage fallback retrieval to guarantee Username is ALWAYS retrieved
    let uname = location.state?.username || "";

    if (!uname) {
      const activeUserStr = localStorage.getItem("guardianx_user");
      if (activeUserStr) {
        try {
          const parsed = JSON.parse(activeUserStr);
          uname = parsed.username || parsed.name || parsed.email?.split("@")[0] || "";

          API.post("/admin/audit-logs", {
            user_id: parsed.id,
            email: parsed.email,
            event_type: "LOGOUT",
            status: "SUCCESS",
          }).catch(() => {});
        } catch {}
      }
    }

    if (!uname) {
      try {
        const accounts = JSON.parse(localStorage.getItem("guardianx_accounts") || "[]");
        if (accounts.length > 0) {
          const lastAcc = accounts[accounts.length - 1];
          uname = lastAcc.username || lastAcc.name || lastAcc.email?.split("@")[0] || "";
        }
      } catch {}
    }

    if (!uname) uname = "User";

    setUsername(uname);

    // Clear active session identifiers
    localStorage.removeItem("guardianx_user");
    localStorage.removeItem("guardianx_dashboard");

    // Progress timer
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 5;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            navigate("/login");
          }, 450);
          return 100;
        }
        return next;
      });
    }, 75);

    return () => clearInterval(timer);
  }, [navigate, location.state]);

  return (
    <div className="min-h-screen bg-[#02081f] flex flex-col justify-center items-center overflow-hidden relative px-4 text-white font-sans">
      {/* Moving Horizontal Data Lines Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Radiant Central Blue Ambient Halo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/20 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Main Center Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-xl w-full">
        
        {/* Central HUD Keyhole Vault & Rotating Aperture Rings */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative flex items-center justify-center mb-4"
        >
          {/* Rotating Blue Conic Sector Sweeps */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full pointer-events-none"
            style={{
              background: "conic-gradient(from 0deg, transparent 0deg, rgba(56, 189, 248, 0.35) 60deg, transparent 65deg, rgba(0, 240, 255, 0.25) 180deg, transparent 200deg)",
            }}
          />

          {/* Outer Segmented HUD Shield Arc (Rotating Clockwise) */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full pointer-events-none flex items-center justify-center"
          >
            <svg viewBox="0 0 300 300" className="w-full h-full text-sky-400 opacity-90">
              <circle cx="150" cy="150" r="140" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="18 12 35 10 5 15" />
              <circle cx="150" cy="150" r="130" fill="none" stroke="#00f0ff" strokeWidth="1.5" strokeDasharray="4 8 20 6" />
            </svg>
          </motion.div>

          {/* Middle Counter-Rotating Gauge Arc (Rotating Counter-Clockwise) */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
            className="absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full pointer-events-none flex items-center justify-center"
          >
            <svg viewBox="0 0 250 250" className="w-full h-full text-cyan-400 opacity-90">
              <circle cx="125" cy="125" r="115" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="12 6 30 8" />
              <circle cx="125" cy="125" r="105" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2 6 15 4" />
            </svg>
          </motion.div>

          {/* Core Keyhole Circle Vault */}
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-[#041235]/90 border-2 border-sky-400 flex flex-col items-center justify-center shadow-[0_0_55px_rgba(56,189,248,0.6)] relative z-10">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-b from-sky-500/30 to-blue-600/40 border border-cyan-400/60 flex items-center justify-center shadow-inner">
              {/* Glowing Keyhole Icon */}
              <svg viewBox="0 0 100 100" className="w-12 h-12 text-cyan-300 drop-shadow-[0_0_20px_#00f0ff]">
                <circle cx="50" cy="38" r="16" fill="currentColor" />
                <path d="M 42 45 L 36 78 H 64 L 58 45 Z" fill="currentColor" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* GIANT HIGH-VISIBILITY USERNAME DISPLAY BANNER */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="my-5 bg-[#041235]/95 border-2 border-sky-400/60 rounded-2xl px-10 py-4 shadow-[0_0_40px_rgba(56,189,248,0.5)] flex flex-col items-center justify-center gap-1.5 backdrop-blur-lg w-full"
        >
          <div className="flex items-center gap-2 text-xs font-cyber text-sky-300 font-bold uppercase tracking-widest">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            LOGGING OUT USER
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-extrabold text-white tracking-wider glow-text-cyan">
            @{username}
          </div>
        </motion.div>

        {/* Progress Bar & Status Line */}
        <div className="w-full space-y-2.5">
          <div className="flex justify-between items-center text-xs font-cyber">
            <span className="text-sky-300/80 tracking-widest uppercase">DISCONNECTING SESSION FOR @{username}</span>
            <span className="text-cyan-400 font-bold font-mono text-base">{progress}%</span>
          </div>

          {/* Electric Cyan Progress Bar */}
          <div className="w-full h-3.5 bg-[#030d29] border border-sky-400/40 rounded-full overflow-hidden p-0.5 shadow-[inset_0_0_12px_rgba(0,0,0,0.9)]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 via-sky-400 to-cyan-300 shadow-[0_0_20px_#38bdf8]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          <p className="text-sky-300/80 text-xs font-cyber uppercase tracking-widest pt-1 blink-text">
            {progress < 100 ? `Releasing secure session for @${username}...` : `Session Sealed — Goodbye @${username}`}
          </p>
        </div>

      </div>
    </div>
  );
}

export default LogoutScreen;