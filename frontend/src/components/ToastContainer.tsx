import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaInfoCircle,
  FaTimes,
  FaTerminal
} from "react-icons/fa";
import type { ToastData } from "../utils/showToast";

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    const handleToast = (event: Event) => {
      const customEvent = event as CustomEvent<ToastData>;
      const newToast = customEvent.detail;
      setToasts((prev) => [...prev, newToast]);

      const duration = newToast.duration || 5000;
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, duration);
    };

    window.addEventListener("guardianx-toast", handleToast);
    return () => {
      window.removeEventListener("guardianx-toast", handleToast);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getStyle = (type: string) => {
    switch (type) {
      case "success":
        return {
          border: "border-emerald-500/40",
          bg: "bg-emerald-950/20",
          text: "text-emerald-400",
          glow: "shadow-[0_0_15px_rgba(16,185,129,0.15)]",
          icon: <FaCheckCircle className="text-emerald-400 text-xl" />,
          label: "SUCCESS_GRANTED"
        };
      case "danger":
        return {
          border: "border-red-500/40",
          bg: "bg-red-950/20",
          text: "text-red-400",
          glow: "shadow-[0_0_15px_rgba(239,68,68,0.15)]",
          icon: <FaTimesCircle className="text-red-400 text-xl" />,
          label: "CRITICAL_THREAT"
        };
      case "warning":
        return {
          border: "border-amber-500/40",
          bg: "bg-amber-950/20",
          text: "text-amber-400",
          glow: "shadow-[0_0_15px_rgba(245,158,11,0.15)]",
          icon: <FaExclamationTriangle className="text-amber-400 text-xl" />,
          label: "WARN_AUTHORIZE"
        };
      default:
        return {
          border: "border-cyan-500/40",
          bg: "bg-cyan-950/20",
          text: "text-cyan-400",
          glow: "shadow-[0_0_15px_rgba(6,182,212,0.15)]",
          icon: <FaInfoCircle className="text-cyan-400 text-xl" />,
          label: "SYSTEM_INFO"
        };
    }
  };

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 w-full max-w-[380px] pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const style = getStyle(toast.type);
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95, transition: { duration: 0.2 } }}
              className={`pointer-events-auto relative overflow-hidden rounded-xl border backdrop-blur-md p-4 flex gap-3.5 transition-all ${style.border} ${style.bg} ${style.glow}`}
            >
              {/* Futuristic Cyber Scanning Line */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[pulse_1.5s_infinite]" />

              {/* Icon wrapper */}
              <div className="flex-shrink-0 flex items-center justify-center">
                {style.icon}
              </div>

              {/* Toast Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] tracking-widest uppercase font-mono font-bold text-zinc-500 flex items-center gap-1">
                    <FaTerminal className="text-[8px]" /> {style.label}
                  </span>
                </div>
                <h4 className="text-sm font-bold font-cyber text-zinc-100 tracking-wide">
                  {toast.title}
                </h4>
                <p className="text-xs text-zinc-400 font-mono mt-1 leading-relaxed">
                  {toast.message}
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 self-start text-zinc-500 hover:text-zinc-300 transition-colors p-1"
              >
                <FaTimes size={12} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
