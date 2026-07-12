import { FaUserCircle, FaArrowLeft, FaExchangeAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function SwitchAccount() {
  const navigate = useNavigate();

  const currentUser = JSON.parse(
    localStorage.getItem("guardianx_user") || "{}"
  );

  const accounts = JSON.parse(
    localStorage.getItem("guardianx_accounts") || "[]"
  );

  const [selectedAccount, setSelectedAccount] = useState<any>(null);

  const switchAccount = () => {
    if (!selectedAccount) return;

    localStorage.setItem(
      "guardianx_user",
      JSON.stringify(selectedAccount)
    );

    localStorage.setItem(
      "userEmail",
      selectedAccount.email
    );

    navigate("/dashboard", { replace: true });

    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white flex justify-center items-center">

      <div className="w-[700px] bg-[#161616] rounded-2xl border border-cyan-500 shadow-xl p-8">

        <div className="flex items-center gap-4">

          <button
            onClick={() => navigate(-1)}
            className="text-cyan-400"
          >
            <FaArrowLeft size={22} />
          </button>

          <div>

            <h1 className="text-3xl font-bold text-cyan-400">
              Switch Account
            </h1>

            <p className="text-zinc-400">
              Select the account you want to continue with.
            </p>

          </div>

        </div>

        <div className="mt-8 space-y-5">

          {accounts.map((acc: any) => (

            <div
              key={acc.email}
              className={`border rounded-xl p-5 flex justify-between items-center ${
                acc.email === currentUser.email
                  ? "border-green-500 bg-[#202020]"
                  : "border-zinc-700 hover:border-cyan-500 cursor-pointer"
              }`}
              onClick={() => {
                if (acc.email !== currentUser.email) {
                  setSelectedAccount(acc);
                }
              }}
            >

              <div className="flex items-center gap-4">

                <FaUserCircle
                  size={45}
                  className="text-cyan-400"
                />

                <div>

                  <h2 className="font-bold text-lg">
                    {acc.name}
                  </h2>

                  <p className="text-zinc-400">
                    {acc.email}
                  </p>

                </div>

              </div>

              {acc.email === currentUser.email ? (

                <span className="bg-green-500 text-black px-4 py-2 rounded-lg font-bold">
                  Current
                </span>

              ) : (

                <button
                  className="bg-cyan-500 hover:bg-cyan-400 text-black px-5 py-2 rounded-lg font-bold flex items-center gap-2"
                >
                  <FaExchangeAlt />
                  Select
                </button>

              )}

            </div>

          ))}

        </div>

        {selectedAccount && (

          <div className="mt-8 bg-[#202020] border border-cyan-500 rounded-xl p-6">

            <h2 className="text-2xl font-bold text-cyan-400">
              Confirm Switch
            </h2>

            <p className="mt-3 text-zinc-300">
              Switch from
              <span className="text-green-400 font-bold">
                {" "}
                {currentUser.name}
              </span>
              {" "}to{" "}
              <span className="text-cyan-400 font-bold">
                {selectedAccount.name}
              </span>
              ?
            </p>

            <div className="flex gap-4 mt-6">

              <button
                onClick={() => setSelectedAccount(null)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 py-3 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={switchAccount}
                className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-lg"
              >
                Switch Account
              </button>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

export default SwitchAccount;