import { useState } from "react";
import {
  scanEmail,
  getCurrentUser,
} from "../services/auth";

function EmailScanner() {
  const [email, setEmail] = useState("");
  const MAX_EMAIL_LENGTH = 3000;

  const handleScan = async () => {
    console.log("========== Scan Button Clicked ==========");

    if (!email.trim()) {
      alert("Paste an email first.");
      return;
    }

    if (email.length > MAX_EMAIL_LENGTH) {
  alert(
    "Email is too large to paste. Please upload an email file (.eml, .msg, or .txt)."
  );
  return;
}

    console.log("Email Sent:");
    console.log(email);

    try {
      const user = getCurrentUser();

const res = await scanEmail({
  user_id: user.id,
  email: email,
});

      console.log("Backend Response:");
      console.log(res);

      alert(
        `Status: ${res.status}

Confidence: ${res.confidence}%

Matched Words:
${res.matched_words.join(", ")}`
      );
    } catch (err: any) {
      console.log("========== ERROR ==========");

      console.log(err);

      if (err.response) {
        console.log("Status:", err.response.status);
        console.log("Data:", err.response.data);
      }

      alert("Unable to scan email");
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white p-14">
      <h1 className="text-6xl font-bold text-cyan-400">
        Email Scanner
      </h1>

      <p className="text-zinc-400 mt-5 text-2xl">
        Paste an email below to check whether it is phishing.
      </p>

      <textarea
  value={email}
  onChange={(e) => 
    setEmail(e.target.value)}

   
  placeholder="Paste the email here..."
  className="w-full h-[450px] mt-10 bg-[#161616] rounded-xl p-8 text-xl"
/>

<div className="flex justify-between mt-2">

  <p
    className={`text-sm ${
      email.length > MAX_EMAIL_LENGTH * 0.9
        ? "text-yellow-400"
        : "text-zinc-400"
    }`}
  >
    {email.length}/{MAX_EMAIL_LENGTH} characters
  </p>

  {email.length > MAX_EMAIL_LENGTH && (

    <p className="text-red-400 text-sm">

      Email is too large to paste. Please upload an email file (.eml, .msg, or .txt) for scanning.

    </p>

  )}

</div>

      <button
  onClick={handleScan}
  disabled={
    email.length === 0 ||
    email.length > MAX_EMAIL_LENGTH
  }
  className={`mt-10 font-bold px-16 py-6 rounded-xl text-2xl transition ${
    email.length === 0 ||
    email.length > MAX_EMAIL_LENGTH
      ? "bg-gray-600 cursor-not-allowed text-gray-300"
      : "bg-cyan-500 hover:bg-cyan-600 text-black"
  }`}
>
        Scan Email
      </button>
    </div>
  );
}

export default EmailScanner;