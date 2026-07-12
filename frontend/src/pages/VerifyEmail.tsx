import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function VerifyEmail() {

  const navigate = useNavigate();

  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");

  const verifyOTP = async () => {

    const response = await fetch(
      "http://127.0.0.1:8000/users/verify-email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          otp
        })
      }
    );

    const data = await response.json();

    if (response.ok) {

      alert("Email Verified Successfully.");

      navigate("/login");

    } else {

      alert(data.detail);

    }

  };

  const resendOTP = async () => {

    await fetch(
      "http://127.0.0.1:8000/users/resend-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email
        })
      }
    );

    alert("OTP Sent Again.");

  };

  return (

    <div className="min-h-screen flex justify-center items-center bg-[#09090B]">

      <div className="bg-[#161616] rounded-xl p-10 w-[420px]">

        <h1 className="text-3xl text-cyan-400 font-bold">

          Verify Email

        </h1>

        <p className="text-zinc-400 mt-3">

          OTP sent to

        </p>

        <p className="text-green-400">

          {email}

        </p>

        <input

          className="w-full mt-8 bg-[#202020] rounded-lg p-4"

          placeholder="Enter 6-digit OTP"

          value={otp}

          onChange={(e)=>setOtp(e.target.value)}

        />

        <button

          onClick={verifyOTP}

          className="w-full mt-6 bg-cyan-500 text-black font-bold rounded-lg p-3"

        >

          Verify

        </button>

        <button

          onClick={resendOTP}

          className="w-full mt-4 bg-zinc-700 rounded-lg p-3"

        >

          Resend OTP

        </button>

      </div>

    </div>

  );

}

export default VerifyEmail;