import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { getCurrentUser } from "../services/auth";

function LoadingScreen() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  const user = getCurrentUser();
  const username = user?.username || user?.name || user?.email?.split("@")[0] || "User";

  // Progress timer for login transition
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 4;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            navigate("/dashboard");
          }, 400);
          return 100;
        }
        return next;
      });
    }, 70);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    /* FIXED STATIC RED (RIGHT) & BLUE (LEFT) BACKGROUND MATCHING IMAGE (NO MOVING CANVAS) */
    <div className="min-h-screen bg-gradient-to-r from-[#020d2a] via-[#040816] to-[#320412] flex flex-col justify-center items-center overflow-hidden relative px-4 text-white font-sans">
      
      {/* STATIC DUAL-TONE AMBIENT GLOWS: BLUE (LEFT) & RED (RIGHT) */}
      <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-blue-600/35 to-transparent blur-[140px] pointer-events-none z-0" />
      <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-rose-600/35 to-transparent blur-[140px] pointer-events-none z-0" />

      {/* STATIC MOTHERBOARD CIRCUIT BOARD ETCHINGS BACKGROUND (FIXED - NO MOVEMENT) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30 flex justify-between items-center px-10">
        {/* Left Side Blue Circuit Board Etchings */}
        <svg width="400" height="600" viewBox="0 0 400 600" className="text-sky-400">
          <path d="M 0 50 H 120 L 180 110 V 220 L 250 290 H 400" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="8 4" />
          <path d="M 0 150 H 80 L 140 210 V 350 L 220 430 H 400" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M 0 300 H 150 L 220 370 V 480 H 400" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <path d="M 0 450 H 100 L 160 510 H 400" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="12 6" />
          <circle cx="120" cy="50" r="5" fill="#00f0ff" />
          <circle cx="180" cy="110" r="6" fill="#38bdf8" />
          <circle cx="250" cy="290" r="7" fill="#00f0ff" />
          <circle cx="140" cy="210" r="5" fill="#38bdf8" />
          <circle cx="220" cy="370" r="6" fill="#00f0ff" />
          <rect x="40" y="200" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" />
          <rect x="110" y="380" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>

        {/* Right Side Red Circuit Board Etchings */}
        <svg width="400" height="600" viewBox="0 0 400 600" className="text-rose-500">
          <path d="M 400 50 H 280 L 220 110 V 220 L 150 290 H 0" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="8 4" />
          <path d="M 400 150 H 320 L 260 210 V 350 L 180 430 H 0" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M 400 300 H 250 L 180 370 V 480 H 0" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <path d="M 400 450 H 300 L 240 510 H 0" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="12 6" />
          <circle cx="280" cy="50" r="5" fill="#f43f5e" />
          <circle cx="220" cy="110" r="6" fill="#fb7185" />
          <circle cx="150" cy="290" r="7" fill="#f43f5e" />
          <circle cx="260" cy="210" r="5" fill="#fb7185" />
          <circle cx="180" cy="370" r="6" fill="#f43f5e" />
          <rect x="330" y="200" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" />
          <rect x="250" y="380" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      {/* FIXED VERTICAL AND HORIZONTAL LASER CROSSHAIR LINES (MATCHING IMAGE) */}
      <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-[#00f0ff]/50 shadow-[0_0_15px_#00f0ff] pointer-events-none z-0" />
      <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#00f0ff]/50 shadow-[0_0_15px_#00f0ff] pointer-events-none z-0" />

      {/* Main Center Content Area */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-xl w-full">
        
        {/* Central Neon Cyan Padlock & Laser Reticle Crosshair (Exact Replica of Image) */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative flex items-center justify-center mb-4"
        >
          {/* Laser Crosshair Reticle Box around Padlock (Matching Image) */}
          <div className="absolute w-56 h-56 border border-cyan-400/40 shadow-[0_0_35px_rgba(0,240,255,0.35)] pointer-events-none flex items-center justify-center">
            {/* Dark Blue Left Corner Reticles */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
            {/* Dark Red Right Corner Reticles */}
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-rose-500" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-rose-500" />
          </div>

          {/* EXACT GLOWING CYAN PADLOCK REPLICA FROM IMAGE */}
          <div className="w-48 h-56 flex flex-col items-center justify-center relative z-10 drop-shadow-[0_0_40px_#00f0ff]">
            <svg viewBox="0 0 160 200" className="w-full h-full text-[#00f0ff]">
              <defs>
                <filter id="padlockGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Padlock Shackle */}
              <path
                d="M 45 85 V 48 A 35 35 0 0 1 115 48 V 85"
                fill="none"
                stroke="#00f0ff"
                strokeWidth="7.5"
                strokeLinecap="round"
                filter="url(#padlockGlowFilter)"
              />

              {/* Padlock Body Box */}
              <rect
                x="28"
                y="85"
                width="104"
                height="82"
                rx="10"
                fill="rgba(4, 18, 50, 0.85)"
                stroke="#00f0ff"
                strokeWidth="6"
                filter="url(#padlockGlowFilter)"
              />

              {/* Inner Keyhole Circle & Stem */}
              <circle cx="80" cy="118" r="10" fill="#00f0ff" filter="url(#padlockGlowFilter)" />
              <path d="M 74 122 L 70 148 H 90 L 86 122 Z" fill="#00f0ff" filter="url(#padlockGlowFilter)" />
            </svg>
          </div>
        </motion.div>

        {/* GIANT USERNAME DISPLAY BANNER (DARK BLUE & DARK RED CYBER BANNER) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="my-5 bg-gradient-to-r from-[#020d2a]/95 via-[#060a1e]/95 to-[#320412]/95 border-2 border-cyan-400/60 rounded-2xl px-10 py-4 shadow-[0_0_40px_rgba(0,240,255,0.4)] flex flex-col items-center justify-center gap-1.5 backdrop-blur-lg w-full"
        >
          <div className="flex items-center gap-2 text-xs font-cyber text-sky-300 font-bold uppercase tracking-widest">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            AUTHENTICATING SESSION FOR
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-extrabold text-white tracking-wider glow-text-cyan">
            @{username}
          </div>
        </motion.div>

        {/* Progress Bar & Status Line */}
        <div className="w-full space-y-2.5">
          <div className="flex justify-between items-center text-xs font-cyber">
            <span className="text-sky-300/80 tracking-widest uppercase">INITIALIZATION PROGRESS FOR @{username}</span>
            <span className="text-[#00f0ff] font-bold font-mono text-base">{progress}%</span>
          </div>

          {/* Dual Dark Blue & Dark Red Gradient Progress Bar */}
          <div className="w-full h-3.5 bg-[#030718] border border-cyan-400/40 rounded-full overflow-hidden p-0.5 shadow-[inset_0_0_12px_rgba(0,0,0,0.9)]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-rose-500 shadow-[0_0_20px_#00f0ff]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          <p className="text-sky-300/80 text-xs font-cyber uppercase tracking-widest pt-1 blink-text">
            {progress < 100
              ? `Establishing encrypted session for @${username}...`
              : `Clearance Verified — Welcome @${username}`}
          </p>
        </div>

      </div>
    </div>
  );
}

export default LoadingScreen;