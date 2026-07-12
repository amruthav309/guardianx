import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaShieldAlt } from "react-icons/fa";
import { motion } from "motion/react";

function LoadingScreen() {

  const navigate = useNavigate();

  const [progress, setProgress] = useState(0);

  const [message, setMessage] = useState(
    "Initializing GuardianX..."
  );

  useEffect(() => {

    const messages = [
      "Initializing GuardianX...",
      "Loading AI Engine...",
      "Loading Firewall...",
      "Loading Threat Intelligence...",
      "Verifying Secure Login...",
      "Preparing Dashboard..."
    ];

    let index = 0;

    const timer = setInterval(() => {

      index++;

      setProgress((prev) => {

        const next = prev + 20;

        if (next >= 100) {

          clearInterval(timer);

          setTimeout(() => {

            navigate("/dashboard");

          }, 800);

          return 100;

        }

        if (index < messages.length) {

          setMessage(messages[index]);

        }

        return next;

      });

    }, 700);

    return () => clearInterval(timer);

  }, [navigate]);

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#05070A] via-[#081018] to-black flex justify-center items-center overflow-hidden relative">

      {/* Background Glow */}

      <div className="absolute w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>

      <div className="absolute w-80 h-80 bg-blue-500/10 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>

      <div className="relative z-10 w-[600px] text-center">

        {/* Logo */}

        <div className="flex justify-center">

          <motion.div

            animate={{
              rotate: 360,
              scale: [1, 1.12, 1],
              boxShadow: [
                "0 0 20px #06b6d4",
                "0 0 70px #06b6d4",
                "0 0 20px #06b6d4",
              ],
            }}

            transition={{
              rotate: {
                duration: 4,
                repeat: Infinity,
                ease: "linear",
              },
              scale: {
                duration: 2,
                repeat: Infinity,
              },
              boxShadow: {
                duration: 2,
                repeat: Infinity,
              },
            }}

            className="rounded-full bg-cyan-500/10 border border-cyan-400 p-8"

          >

            <FaShieldAlt
              size={80}
              className="text-cyan-400"
            />

          </motion.div>

        </div>

        <motion.h1

          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}

          className="text-5xl font-bold text-cyan-400 mt-8"

        >

          GuardianX

        </motion.h1>

        <p className="text-zinc-400 mt-3 text-lg">

          AI Powered Cyber Security Platform

        </p>

        <div className="mt-10">

          <motion.p

            key={message}

            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}

            className="text-cyan-300 text-lg"

          >

            {message}

          </motion.p>

          <div className="w-full h-4 bg-[#202020] rounded-full overflow-hidden mt-6">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 via-cyan-200 to-cyan-400"
              animate={{
                width: `${progress}%`,
              }}
              transition={{
                duration: 0.5,
              }}
            />

          </div>

          <p className="text-cyan-400 text-xl font-bold mt-4">
            {progress}%
          </p>

        </div>

      </div>

    </div>

  );

}

export default LoadingScreen;