import { FaUserCircle, FaArrowLeft, FaExchangeAlt, FaPlus } from "react-icons/fa";
import { useNavigate, Navigate } from "react-router-dom";
import { getCurrentUser } from "../services/auth";

function SwitchAccount() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  // Authentication guard
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const accounts = JSON.parse(
    localStorage.getItem("guardianx_accounts") || "[]"
  );

  const switchAccount = (account: any) => {
    if (!account) return;

    // Critical: Clear dashboard cache to prevent database scan histories from merging/bleeding
    localStorage.removeItem("guardianx_dashboard");

    localStorage.setItem(
      "guardianx_user",
      JSON.stringify(account)
    );

    localStorage.setItem(
      "userEmail",
      account.email
    );

    navigate("/dashboard", { replace: true });
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white flex justify-center items-center p-6 relative overflow-hidden page-enter">
      {/* Decorative glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>

      <div className="w-[650px] glass-panel-cyan rounded-2xl border border-cyan-500/20 shadow-2xl p-8 relative z-20">
        <div className="flex items-center justify-between pb-6 border-b border-zinc-800">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-cyan-400 hover:text-cyan-300 transition-colors p-2 bg-cyan-500/10 rounded-lg"
            >
              <FaArrowLeft size={16} />
            </button>
            <div>
              <h1 className="text-2xl font-bold font-cyber text-cyan-400 glow-text-cyan">
                Identity Matrix
              </h1>
              <p className="text-zinc-500 text-xs mt-0.5">
                Switch between active authorization identities
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/login?mode=add")}
            className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded-lg text-xs font-bold font-cyber flex items-center gap-2 glow-cyan transition-all cursor-pointer"
          >
            <FaPlus size={10} />
            Add Account
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {accounts.map((acc: any) => {
            const isActive = acc.email === currentUser.email;
            return (
              <div
                key={acc.email}
                className={`border rounded-xl p-4 flex justify-between items-center transition-all ${
                  isActive
                    ? "border-green-500 bg-green-500/5 shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                    : "border-zinc-800 bg-[#0e0e11]/80 hover:border-cyan-500/50 cursor-pointer"
                }`}
                onClick={() => {
                  if (!isActive) {
                    switchAccount(acc);
                  }
                }}
              >
                <div className="flex items-center gap-4">
                  {acc.profile_pic ? (
                    <img
                      src={acc.profile_pic}
                      alt={acc.name}
                      className="w-12 h-12 rounded-xl object-cover border border-cyan-500/30"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/15 flex items-center justify-center border border-cyan-500/30 text-cyan-400">
                      <FaUserCircle size={28} />
                    </div>
                  )}
                  <div>
                    <h2 className="font-bold text-sm text-zinc-100 font-cyber">
                      {acc.name}
                    </h2>
                    <p className="text-zinc-500 text-xs font-mono mt-0.5">
                      {acc.email}
                    </p>
                  </div>
                </div>

                {isActive ? (
                  <span className="bg-green-500/20 border border-green-500/30 text-green-400 px-3 py-1.5 rounded-lg text-xs font-bold font-cyber">
                    Active
                  </span>
                ) : (
                  <button
                    className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-black px-4 py-1.5 rounded-lg text-xs font-bold font-cyber flex items-center gap-2 transition-all"
                  >
                    <FaExchangeAlt size={10} />
                    Switch
                  </button>
                )}
              </div>
            );
          })}
        </div>


      </div>
    </div>
  );
}

export default SwitchAccount;