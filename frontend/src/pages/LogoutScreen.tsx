import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaShieldAlt, FaCheckCircle } from "react-icons/fa";
import { logoutUser } from "../services/auth";

function LogoutScreen() {

  const navigate = useNavigate();

  const [step, setStep] = useState(0);

  const messages = [
    "Terminating Secure Session...",
    "Clearing Authentication Tokens...",
    "Encrypting User Data...",
    "Session Successfully Secured"
  ];

  useEffect(() => {

    logoutUser();

    const timer1 = setTimeout(() => setStep(1), 1000);

    const timer2 = setTimeout(() => setStep(2), 2000);

    const timer3 = setTimeout(() => setStep(3), 3000);

    const timer4 = setTimeout(() => {
      navigate("/login");
    }, 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };

  }, [navigate]);

    return (

    <div className="min-h-screen bg-[#09090B] flex items-center justify-center overflow-hidden">

      <div className="w-[500px] bg-[#161616] rounded-3xl border border-cyan-500/30 shadow-[0_0_40px_rgba(0,255,255,0.25)] p-10 text-center">

        <div className="flex justify-center">

          {step < 3 ? (

            <FaShieldAlt
              size={90}
              className="text-cyan-400 animate-pulse"
            />

          ) : (

            <FaCheckCircle
              size={90}
              className="text-green-400 animate-bounce"
            />

          )}

        </div>

        <h1 className="text-5xl font-bold text-cyan-400 mt-6">

          GuardianX

        </h1>

        <p className="text-zinc-400 mt-2">

          AI Powered Cyber Security Platform

        </p>

        <div className="mt-10 h-14 flex items-center justify-center">

          <h2 className="text-2xl font-semibold text-white">

            {messages[step]}

          </h2>

        </div>

        <div className="mt-10">

          <div className="w-full h-3 rounded-full bg-[#2b2b2b] overflow-hidden">

            <div
              className={`h-full bg-cyan-400 transition-all duration-1000 ${
                step === 0
                  ? "w-[25%]"
                  : step === 1
                  ? "w-[50%]"
                  : step === 2
                  ? "w-[75%]"
                  : "w-full"
              }`}
            />

          </div>

          <p className="text-zinc-500 mt-4">

            Redirecting to Login...

          </p>

        </div>

      </div>

    </div>

  );

}

export default LogoutScreen;