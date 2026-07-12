import { useState } from "react";
import {
  scanSMS,
  getCurrentUser,
} from "../services/auth";

function SMSScanner() {

  const [sms, setSms] = useState("");

  const handleScan = async () => {

    if (!sms.trim()) {
      alert("Paste an SMS first.");
      return;
    }

    try {

      const user = getCurrentUser();

const res = await scanSMS({
  user_id: user.id,
  sms: sms,
});

      alert(
`Status: ${res.status}

Confidence: ${res.confidence}%

Matched Words:
${res.matched_words.join(", ")}`
      );

    } catch (err) {

      console.log(err);

      alert("Unable to scan SMS");

    }

  };

  return (

    <div className="min-h-screen bg-[#09090B] text-white p-14">

      <h1 className="text-6xl font-bold text-cyan-400">
        SMS Scanner
      </h1>

      <p className="text-zinc-400 mt-5 text-2xl">
        Paste an SMS below to check whether it is phishing.
      </p>

      <textarea
        value={sms}
        onChange={(e) => setSms(e.target.value)}
        placeholder="Paste SMS here..."
        className="w-full h-[450px] mt-10 bg-[#161616] rounded-xl p-8 text-xl"
      />

      <button
        onClick={handleScan}
        className="mt-10 bg-cyan-500 hover:bg-cyan-600 text-black font-bold px-16 py-6 rounded-xl text-2xl"
      >
        Scan SMS
      </button>

    </div>

  );

}

export default SMSScanner;