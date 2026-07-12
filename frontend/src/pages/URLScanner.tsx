import { useState } from "react";
import {
  scanURL,
  getCurrentUser,
} from "../services/auth";

function URLScanner() {
  const [url, setUrl] = useState("");

  const handleScan = async () => {
    if (!url.trim()) {
      alert("Enter a URL first.");
      return;
    }

    try {
      const user = getCurrentUser();

const res = await scanURL({
  user_id: user.id,
  url: url,
});

      alert(
        `Status: ${res.status}

Confidence: ${res.confidence}%

Matched Words:
${res.matched_words.join(", ")}`
      );
    } catch (err) {
      console.log(err);
      alert("Unable to scan URL");
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white p-14">

      <h1 className="text-6xl font-bold text-cyan-400">
        URL Scanner
      </h1>

      <p className="text-zinc-400 mt-5 text-2xl">
        Paste a URL below to check whether it is phishing.
      </p>

      <textarea
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste URL here..."
        className="w-full h-[300px] mt-10 bg-[#161616] rounded-xl p-8 text-xl"
      />

      <button
        onClick={handleScan}
        className="mt-10 bg-cyan-500 hover:bg-cyan-600 text-black font-bold px-16 py-6 rounded-xl text-2xl"
      >
        Scan URL
      </button>

    </div>
  );
}

export default URLScanner;