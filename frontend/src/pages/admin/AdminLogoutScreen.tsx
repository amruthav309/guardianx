import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import API from "../../services/auth";

function AdminLogoutScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [username, setUsername] = useState("Master Admin");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Canvas for Horizontal Streaming Red Light Rays
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
      ctx.fillStyle = "rgba(10, 3, 5, 0.4)";
      ctx.fillRect(0, 0, width, height);

      lines.forEach((l) => {
        l.x += l.speed * l.direction;

        ctx.beginPath();
        ctx.moveTo(l.x, l.y);
        ctx.lineTo(l.x - l.length * l.direction, l.y);
        ctx.strokeStyle = `rgba(239, 68, 68, ${l.alpha})`;
        ctx.lineWidth = 1.6;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(l.x, l.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(248, 113, 113, ${l.alpha + 0.2})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#ef4444";
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
    let uname = location.state?.username || "";

    if (!uname) {
      const activeUserStr = localStorage.getItem("guardianx_user");
      if (activeUserStr) {
        try {
          const parsed = JSON.parse(activeUserStr);
          uname = parsed.username || parsed.name || parsed.email?.split("@")[0] || "";

          API.post("/admin/audit-logs", {
            user_id: parsed.id || 999,
            email: parsed.email || "admin@guardianx.com",
            event_type: "LOGOUT",
            status: "SUCCESS",
          }).catch(() => {});
        } catch {}
      }
    }

    if (!uname) uname = "Master Admin";
    setUsername(uname);

    // Clear active admin session
    localStorage.removeItem("guardianx_user");
    localStorage.removeItem("guardianx_dashboard");

    // Progress timer
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 5;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            navigate("/admin/login");
          }, 450);
          return 100;
        }
        return next;
      });
    }, 75);

    return () => clearInterval(timer);
  }, [navigate, location.state]);

  return (
    <div className="min-[#090305] min-h-screen bg-[#090305] flex flex-col justify-center items-center overflow-hidden relative px-4 text-white font-sans">
      {/* Moving Horizontal Data Lines Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Radiant Central Red Ambient Halo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-red-600/20 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Main Center Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-xl w-full">
        
        {/* HUD Rings & Central Vault Aperture */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative flex items-center justify-center mb-4"
        >
          {/* Rotating Red Conic Sweeps */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full pointer-events-none"
            style={{
              background: "conic-gradient(from 0deg, transparent 0deg, rgba(239, 68, 68, 0.35) 60deg, transparent 65deg, rgba(248, 113, 113, 0.25) 180deg, transparent 200deg)",
            }}
          />

          {/* Outer Segmented HUD Shield Arc */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full pointer-events-none flex items-center justify-center"
          >
            <svg viewBox="0 0 300 300" className="w-full h-full text-red-500 opacity-90">
              <circle cx="150" cy="150" r="140" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="18 12 35 10 5 15" />
              <circle cx="150" cy="150" r="130" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 8 20 6" />
            </svg>
          </motion.div>

          {/* Center Shield Container */}
          <div className="w-44 h-44 rounded-full bg-[#140407]/90 border-2 border-red-500/60 shadow-[0_0_50px_rgba(239,68,68,0.4)] flex flex-col items-center justify-center relative z-10 backdrop-blur-md">
            <span className="text-4xl text-red-400 drop-shadow-[0_0_20px_#ef4444]">🛡</span>
            <span className="text-[10px] font-cyber text-red-300 font-bold uppercase tracking-widest mt-1">ADMIN DISCONNECT</span>
          </div>
        </motion.div>

        {/* Username Display Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="my-5 bg-gradient-to-r from-[#1c0409]/95 via-[#090305]/95 to-[#2c030d]/95 border-2 border-red-500/60 rounded-2xl px-10 py-4 shadow-[0_0_40px_rgba(239,68,68,0.4)] flex flex-col items-center justify-center gap-1.5 backdrop-blur-lg w-full"
        >
          <div className="flex items-center gap-2 text-xs font-cyber text-red-300 font-bold uppercase tracking-widest">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            TERMINATING CRIMSON ADMIN SESSION FOR
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-extrabold text-white tracking-wider glow-text-red">
            @{username}
          </div>
        </motion.div>

        {/* Progress Bar & Status */}
        <div className="w-full space-y-2.5">
          <div className="flex justify-between items-center text-xs font-cyber">
            <span className="text-red-300/80 tracking-widest uppercase">DISCONNECTING @{username}</span>
            <span className="text-[#ef4444] font-bold font-mono text-base">{progress}%</span>
          </div>

          <div className="w-full h-3.5 bg-[#0a0305] border border-red-500/40 rounded-full overflow-hidden p-0.5 shadow-[inset_0_0_12px_rgba(0,0,0,0.9)]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-red-700 via-red-500 to-rose-400 shadow-[0_0_20px_#ef4444]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          <p className="text-red-300/80 text-xs font-cyber uppercase tracking-widest pt-1 blink-text">
            {progress < 100
              ? `Purging admin session tokens for @${username}...`
              : `Session Closed — Redirecting to Admin Sign In...`}
          </p>
        </div>

      </div>
    </div>
  );
}

export default AdminLogoutScreen;
