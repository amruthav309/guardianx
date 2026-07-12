import { useState } from "react";
import { addNotification } from "../utils/notifications";
import {
  scanEmail,
  scanURL,
  scanSMS,
  checkPassword,
  uploadFile,
  downloadReport,
  getCurrentUser,
} from "../services/auth";

function QuickScanner() {

  const [scanType, setScanType] = useState("email");

  const [text, setText] = useState("");

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [result, setResult] = useState<any>(null);

  const handleScan = async () => {

    try {

      let input = text;

      if (selectedFile) {

        const uploaded = await uploadFile(selectedFile);

        input = uploaded.content;

      }

      if (!input.trim()) {

        alert("Please paste text or upload a file.");

        return;

      }

      let res;

      switch (scanType) {

  case "email":
    res = await scanEmail({
      email: input,
      user_id: getCurrentUser().id
    });
    break;   // <-- ADD THIS

  case "url":
    res = await scanURL({
      url: input,
      user_id: getCurrentUser().id,
    });
    break;

  case "sms":
    res = await scanSMS({
      sms: input,
      user_id: getCurrentUser().id
    });
    break;   // <-- ADD THIS

  case "password":
    res = await checkPassword(input);
    break;

  default:
    return;
}

      if (res.status === "Error") {
  alert(res.message);
  setResult(null);
  return;
}

setResult(res);

if (scanType === "email") {

  if (res.status === "Phishing") {

    addNotification(
  "🚨 Phishing Email",
  "GuardianX detected a phishing email.",
  "danger"
);

  } else {

    addNotification(
  "✅ Safe Email",
  "Email is safe.",
  "success"
);

  }

}

else if (scanType === "url") {

  if (res.status === "Phishing") {

    addNotification(
  "🌐 Malicious URL",
  "GuardianX blocked a malicious URL.",
  "danger"
);

  } else {

    addNotification(
  "✅ Safe URL",
  "URL is safe.",
  "success"
);

  }

}

else if (scanType === "sms") {

  if (res.status === "Phishing") {

    addNotification(
  "📱 Suspicious SMS",
  "GuardianX detected a phishing SMS.",
  "danger"
);
  } else {

    addNotification(
  "✅ Safe SMS",
  "SMS is safe.",
  "success"
);

  }

}

else if (scanType === "password") {

  addNotification(
  "🔑 Password Checked",
  `Strength: ${res.strength}`,
  "info"
);

}

} catch (error) {

  console.log(error);

  alert("Unable to scan.");

}

};

  const handleDownloadReport = async () => {

    if (!result) return;

    try {

      await downloadReport(result);

    } catch (error) {

      console.log(error);

      alert("Unable to download report.");

    }

  };

  return (

    <div className="bg-[#161616] rounded-2xl p-8 mt-10 shadow-xl">

      <h1 className="text-4xl font-bold text-cyan-400">

        🔎 Quick Scanner

      </h1>

      <p className="text-zinc-400 mt-3">

        Scan emails, URLs, SMS, passwords or uploaded files.

      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-8">

  {[
    { key: "email", icon: "📧", title: "Email" },
    { key: "url", icon: "🌐", title: "URL" },
    { key: "sms", icon: "💬", title: "SMS" },
    { key: "password", icon: "🔑", title: "Password" },
  ].map((item) => (

    <button
      key={item.key}
      onClick={() => setScanType(item.key)}
      className={`rounded-xl p-6 border transition-all duration-300 hover:scale-105

      ${
        scanType === item.key
          ? "border-cyan-400 bg-cyan-500/10 shadow-[0_0_20px_#06b6d4]"
          : "border-zinc-700 bg-[#202020]"
      }`}
    >

      <div className="text-5xl">
        {item.icon}
      </div>

      <h2 className="mt-4 text-xl font-bold">
        {item.title}
      </h2>

    </button>

  ))}

</div>

      <textarea

        value={text}

        onChange={(e) => setText(e.target.value)}

        placeholder={`Paste your ${scanType.toUpperCase()} here for AI security analysis...`}

        className="w-full h-56 bg-[#09090B] rounded-xl mt-8 p-6 text-lg"

      />

      <div className="mt-8">

        <label className="text-cyan-400 text-xl font-bold">

          Upload File

        </label>

        <label

          htmlFor="fileUpload"

          className="mt-4 flex flex-col justify-center items-center h-56 border-2 border-dashed border-cyan-500 rounded-xl cursor-pointer hover:bg-[#1F1F1F] transition"

        >

          <div className="text-6xl">

            📂

          </div>

          <h2 className="text-2xl font-bold mt-4">

            Click to Upload

          </h2>

          <p className="text-zinc-400">

            TXT • PDF • DOCX • EML • PNG • JPG

          </p>

        </label>

        <input

          id="fileUpload"

          type="file"

          className="hidden"

          accept=".txt,.pdf,.docx,.eml,.png,.jpg,.jpeg"

          onChange={(e) => {

            if (e.target.files?.length) {

              setSelectedFile(e.target.files[0]);

            }

          }}

        />

        {selectedFile && (

          <div className="bg-[#09090B] rounded-xl mt-5 p-5">

            <h3 className="text-green-400 font-bold">

              ✔ File Selected

            </h3>

            <p className="mt-3">

              <b>Name :</b> {selectedFile.name}

            </p>

            <p>

              <b>Size :</b>{" "}

              {(selectedFile.size / 1024).toFixed(2)} KB

            </p>

          </div>

        )}

      </div>

      <button

        onClick={handleScan}

        className="w-full mt-8 bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-5 rounded-xl text-lg transition hover:scale-[1.02]"

      >

        🚀 Scan with GuardianX AI

      </button>
            {/* Result */}

      {result && (

        <div className="mt-10 bg-[#09090B] rounded-xl p-6">

          <h2 className="text-3xl font-bold text-cyan-400">

            Scan Result

          </h2>

          {"status" in result && (

            <>

              <div className="mt-6">

                <p className="text-xl">

                  <b>Status :</b>{" "}

                  <span
                    className={
                      result.status === "Phishing"
                        ? "text-red-500"
                        : "text-green-400"
                    }
                  >
                    {result.status}
                  </span>

                </p>

                <p className="mt-3 text-lg">

                  <b>Confidence :</b>{" "}

                  {result.confidence}%

                </p>

              </div>

              <div className="mt-6">

                <h3 className="text-xl font-bold">

                  Matched Words

                </h3>

                <div className="flex flex-wrap gap-3 mt-3">

                  {result.matched_words &&
                  result.matched_words.length > 0 ? (

                    result.matched_words.map(
                      (
                        word: string,
                        index: number
                      ) => (

                        <span
                          key={index}
                          className="bg-red-500 px-3 py-1 rounded-full"
                        >

                          {word}

                        </span>

                      )
                    )

                  ) : (

                    <span className="text-green-400">

                      No suspicious words found

                    </span>

                  )}

                </div>

              </div>

              {/* AI Advisor */}

              {result.advisor && (

                <div className="mt-8 bg-[#161616] border border-cyan-500 rounded-xl p-6">

                  <h2 className="text-2xl font-bold text-cyan-400">

                    🛡 AI Security Advisor

                  </h2>

                  <div className="mt-5">

                    <h3 className="text-xl font-bold">

                      Risk Level :

                      <span
                        className={
                          result.advisor.risk === "HIGH"
                            ? " text-red-500"
                            : " text-green-400"
                        }
                      >

                        {" "}

                        {result.advisor.risk}

                      </span>

                    </h3>

                  </div>

                  <div className="mt-6">

                    <h3 className="text-yellow-400 text-xl font-bold">

                      Why was this flagged?

                    </h3>

                    <ul className="list-disc ml-6 mt-3 space-y-2">

                      {result.advisor.reason.map(
                        (
                          reason: string,
                          index: number
                        ) => (

                          <li key={index}>

                            {reason}

                          </li>

                        )
                      )}

                    </ul>

                  </div>

                  <div className="mt-6">

                    <h3 className="text-green-400 text-xl font-bold">

                      Recommended Actions

                    </h3>

                    <ul className="list-disc ml-6 mt-3 space-y-2">

                      {result.advisor.recommendation.map(
                        (
                          item: string,
                          index: number
                        ) => (

                          <li key={index}>

                            {item}

                          </li>

                        )
                      )}

                    </ul>

                  </div>

                </div>

              )}

            </>

          )}

          {"strength" in result && (

            <>

              <p className="mt-5 text-xl">

                <b>Password Strength :</b>{" "}

                {result.strength}

              </p>

              <p className="mt-2 text-lg">

                <b>Score :</b>{" "}

                {result.score}/100

              </p>

            </>

          )}

          {/* Download PDF */}

          {"status" in result && (
  <div className="mt-8">
    <button
      onClick={handleDownloadReport}
      className="bg-green-500 hover:bg-green-600 text-black font-bold px-8 py-3 rounded-xl"
    >
      📄 Download Security Report
    </button>
  </div>
)}
        </div>

      )}

    </div>

  );

}

export default QuickScanner;