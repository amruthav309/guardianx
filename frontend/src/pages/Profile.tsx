import { useEffect, useState } from "react";
import {
  changePassword,
  getCurrentUser,
  updateProfile ,
} from "../services/auth";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaShieldAlt,
  FaCalendarAlt,
  FaUserEdit,
} from "react-icons/fa";

function Profile() {

 const [sidebarOpen, setSidebarOpen] = useState(() => {
  return localStorage.getItem("sidebarOpen") !== "false";
});

useEffect(() => {
  localStorage.setItem(
    "sidebarOpen",
    String(sidebarOpen)
  );
}, [sidebarOpen]);

  const user = getCurrentUser();

  const [editing, setEditing] = useState(false);

  const [passwordPopup, setPasswordPopup] = useState(false);

  const [name, setName] = useState(user?.name || "");

  const [username, setUsername] = useState(
  user?.username || ""
);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async () => {

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {

      setLoading(true);

      const res = await changePassword({
        email: user?.email,
        current_password: currentPassword,
        new_password: newPassword,
      });

      addNotification(
  "Password Updated",
  "Your password was changed successfully."
);

alert(res.message);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch {

      alert("Unable to change password.");

    } finally {

      setLoading(false);

    }

  };

  const handleProfileUpdate = async () => {

  try {

    const res = await updateProfile(
      user.id,
      {
        name,
        username,
      }
    );

    localStorage.setItem(
      "guardianx_user",
      JSON.stringify({
        ...user,
        name,
        username,
      })
    );

    addNotification(
  "Profile Updated",
  "Your profile has been updated successfully."
);

alert(res.message);

    setEditing(false);

    window.location.reload();

  } catch {

    alert("Unable to update profile.");

  }

};

  return (

    <div className="flex min-h-screen bg-[#09090B] text-white">
      

      {sidebarOpen && <Sidebar />}

      <div className="flex-1 p-5">

        <Topbar />

        <div className="mt-6">

          <h1 className="text-3xl font-bold text-cyan-400">
            My Profile
          </h1>

          <p className="text-zinc-400 mt-2">
            Manage your GuardianX account.
          </p>

        </div>

        <div className="mt-8 bg-[#161616] rounded-xl p-8 border border-cyan-500/20">

          <div className="flex items-center gap-6">

            <FaUserCircle
              size={90}
              className="text-cyan-400"
            />

            <div>

              <h2 className="text-3xl font-bold">
                {user?.name || "User"}
              </h2>

              <p className="text-zinc-400">
                GuardianX User
              </p>

              <button
  onClick={() => setEditing(true)}
  className="mt-4 bg-cyan-500 text-black px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-cyan-400"
>
  <FaUserEdit />
  Edit Profile
</button>

            </div>

          </div>
          {/* Information Cards */}

          <div className="grid md:grid-cols-2 gap-6 mt-10">

            <div className="bg-[#202020] rounded-xl p-5">

              <div className="flex items-center gap-3">

                <FaEnvelope className="text-cyan-400" />

                <h3 className="font-semibold">
                  Email
                </h3>

              </div>

              <p className="mt-4 text-zinc-300">
                {user?.email || "Not Available"}
              </p>

            </div>

            <div className="bg-[#202020] rounded-xl p-5">

              <div className="flex items-center gap-3">

                <FaPhone className="text-cyan-400" />

                <h3 className="font-semibold">
                  Phone
                </h3>

              </div>

              <p className="mt-4 text-zinc-300">
                Not Added
              </p>

            </div>

            <div className="bg-[#202020] rounded-xl p-5">

              <div className="flex items-center gap-3">

                <FaShieldAlt className="text-green-400" />

                <h3 className="font-semibold">
                  Account Status
                </h3>

              </div>

              <p className="mt-4 text-green-400 font-bold">
                {user?.account_status || "Active"}
              </p>

            </div>

            <div className="bg-[#202020] rounded-xl p-5">

              <div className="flex items-center gap-3">

                <FaCalendarAlt className="text-yellow-400" />

                <h3 className="font-semibold">
                  Last Login
                </h3>

              </div>

              <p className="mt-4 text-zinc-300">
                {user?.last_login
                  ? new Date(user.last_login).toLocaleString()
                  : "First Login"}
              </p>

            </div>

          </div>

          {/* Account Information */}

          <div className="mt-10 border-t border-zinc-700 pt-8">

            <h2 className="text-2xl font-bold text-cyan-400">
              Account Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mt-10">
            
            <div>

                <p className="text-zinc-400">
                  Full Name
                </p>

                <p className="font-semibold mt-1">
                  {user?.name || "User"}
                </p>

              </div>

              <div>

                <p className="text-zinc-400">
                  Username
                </p>

                <p className="font-semibold mt-1">
                  {user?.username || "-"}
                </p>

              </div>

              <div>

                <p className="text-zinc-400">
                  Login Count
                </p>

                <p className="font-semibold mt-1">
                  {user?.login_count || 0}
                </p>

              </div>

              <div>

                <p className="text-zinc-400">
                  GuardianX Version
                </p>

                <p className="font-semibold mt-1">
                  v2.0
                </p>

              </div>

            </div>

          </div>
{/* Security */}

<div className="mt-10 border-t border-zinc-700 pt-8">

  <h2 className="text-2xl font-bold text-cyan-400">
    Security
  </h2>

  <button
    onClick={() => setPasswordPopup(true)}
    className="mt-6 w-full bg-[#202020]
    hover:bg-[#252525]
    border border-zinc-700
    rounded-xl
    p-5
    flex
    items-center
    justify-between
    transition"
  >

    <div className="flex items-center gap-4">

      <FaShieldAlt className="text-cyan-400 text-xl"/>

      <div className="text-left">

        <p className="font-semibold">
          Change Password
        </p>

        <p className="text-zinc-400 text-sm">
          Update your account password
        </p>

      </div>

    </div>

    <span className="text-2xl text-zinc-500">
      ›
    </span>

  </button>

</div>

        </div>

      </div>

      

    {/* Edit Profile Popup */}

      {editing && (

        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="bg-[#161616] p-8 rounded-xl w-[420px] border border-cyan-500">

            <h2 className="text-2xl font-bold text-cyan-400 mb-6">
              Edit Profile
            </h2>

            <label className="block mb-2">
              Name
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded bg-[#202020] mb-4"
            />

            <label className="block mb-2">
              Username
            </label>

            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded bg-[#202020] mb-4"
            />

            <label className="block mb-2">
              Email
            </label>

            <input
              value={user?.email}
              disabled
              className="w-full p-3 rounded bg-[#202020] mb-6"
            />

            <div className="flex justify-end gap-4">

              <button
                onClick={() => setEditing(false)}
                className="px-5 py-2 rounded bg-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={handleProfileUpdate}
                className="px-5 py-2 rounded bg-cyan-500 text-black font-bold"
              >
                Save
              </button>

            </div>

          </div>

        </div>

      )}

      {/* Change Password Popup */}

{passwordPopup && (

<div
className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
>

<div className="bg-[#161616] border border-cyan-500 rounded-xl w-[450px] p-8">

<h2 className="text-2xl font-bold text-cyan-400 mb-6">
Change Password
</h2>

<label className="block mb-2 text-zinc-400">
Current Password
</label>

<input
type="password"
value={currentPassword}
onChange={(e)=>setCurrentPassword(e.target.value)}
className="w-full bg-[#202020] rounded-lg p-3 mb-5 outline-none"
/>

<label className="block mb-2 text-zinc-400">
New Password
</label>

<input
type="password"
value={newPassword}
onChange={(e)=>setNewPassword(e.target.value)}
className="w-full bg-[#202020] rounded-lg p-3 mb-5 outline-none"
/>

<label className="block mb-2 text-zinc-400">
Confirm Password
</label>

<input
type="password"
value={confirmPassword}
onChange={(e)=>setConfirmPassword(e.target.value)}
className="w-full bg-[#202020] rounded-lg p-3"
/>

<div className="flex justify-end gap-4 mt-8">

<button

onClick={()=>setPasswordPopup(false)}

className="px-5 py-2 rounded-lg bg-gray-600"

>

Cancel

</button>

<button

onClick={async()=>{

await handlePasswordChange();

setPasswordPopup(false);

}}

disabled={loading}

className="px-5 py-2 rounded-lg bg-cyan-500 text-black font-bold"

>

{loading ? "Updating..." : "Update Password"}

</button>

</div>

</div>

</div>

)}
    
    </div>

  );

}

export default Profile;