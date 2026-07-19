import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaShieldAlt, FaCheckCircle, FaTerminal } from "react-icons/fa";

function LogoutScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const messages = [
    "Decrypting Security Tokens...",
    "Securing Local History Database...",
    "Clearing Cache and Ephemeral States...",
    "Session Securely Sealed"
  ];

  useEffect(() => {
    // Clear active session identifiers, keeping switch list active
    localStorage.removeItem("guardianx_user");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("guardianx_dashboard"); // Clear cached dashboard statistics

    const timer1 = setTimeout(() => setStep(1), 800);
    const timer2 = setTimeout(() => setStep(2), 1600);
    const timer3 = setTimeout(() => setStep(3), 2400);
    const timer4 = setTimeout(() => {
      navigate("/login");
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#070709] flex items-center justify-center overflow-hidden page-enter">
      {/* Laser grid layout */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
      
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-3xl"></div>

      <div className="w-[500px] glass-panel-violet rounded-2xl border border-red-500/20 shadow-2xl p-10 text-center relative z-20">
        <div className="flex justify-center mb-6">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center border transition-all duration-500 ${
            step < 3 
              ? "bg-red-500/10 border-red-500/30 text-red-400 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.2)]" 
              : "bg-green-500/10 border-green-500/30 text-green-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          }`}>
            {step < 3 ? (
              <FaShieldAlt size={45} />
            ) : (
              <FaCheckCircle size={45} />
            )}
          </div>
        </div>

        <h1 className="text-3xl font-bold font-cyber tracking-wider text-zinc-100">
          GUARDIAN<span className="text-red-500">X</span>
        </h1>
        
        <p className="text-zinc-500 text-xs mt-1 uppercase tracking-widest font-cyber">
          Secured Connection Teardown
        </p>

        {/* Terminal log text */}
        <div className="mt-10 h-16 bg-[#0c0c0e] border border-zinc-800 rounded-lg p-3 flex items-center justify-start gap-3 font-mono text-left">
          <FaTerminal className="text-red-500 animate-pulse text-sm" />
          <span className="text-xs text-zinc-300">
            {step < 3 ? "> " : "$ "}{messages[step]}
          </span>
        </div>

        <div className="mt-8">
          <div className="w-full h-1.5 rounded-full bg-[#1b1b22] overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ${
                step === 3 ? "bg-green-500" : "bg-red-500"
              }`}
              style={{
                width: step === 0 ? "25%" : step === 1 ? "50%" : step === 2 ? "75%" : "100%"
              }}
            />
          </div>
          
          <p className="text-zinc-500 text-xs mt-4 uppercase font-cyber tracking-widest blink-text">
            Releasing session keys...
          </p>
        </div>
      </div>
    </div>
  );
}

export default LogoutScreen;