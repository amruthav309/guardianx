import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/auth";

function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  const handleRegister = async (e: any) => {

    e.preventDefault();

    setLoading(true);

    try {

      const res = await registerUser(form);

      alert(res.message);

      navigate("/verify-email", {
        state: {
          email: form.email,
        },
      });

    } catch (err: any) {

      console.log(err);

      if (err.response?.data?.detail) {

        alert(err.response.data.detail);

      } else {

        alert("Registration Failed");

      }

    } finally {

      setLoading(false);

    }

  };
    return (

    <div className="min-h-screen bg-[#09090B] flex justify-center items-center">

      <form
        onSubmit={handleRegister}
        className="bg-[#161616] border border-cyan-500/20 shadow-xl rounded-2xl p-8 w-[430px]"
      >

        <h1 className="text-4xl text-cyan-400 font-bold text-center">

          GuardianX

        </h1>

        <p className="text-center text-zinc-400 mt-2 mb-8">

          Create Your Secure Account

        </p>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg mb-4 bg-[#202020] border border-zinc-700 outline-none focus:border-cyan-400"
        />

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg mb-4 bg-[#202020] border border-zinc-700 outline-none focus:border-cyan-400"
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg mb-4 bg-[#202020] border border-zinc-700 outline-none focus:border-cyan-400"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg mb-6 bg-[#202020] border border-zinc-700 outline-none focus:border-cyan-400"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-500 hover:bg-cyan-600 transition text-black font-bold p-3 rounded-lg"
        >

          {loading ? "Creating Account..." : "Register"}

        </button>

        <p className="text-center text-zinc-400 mt-6">

          Already have an account?

        </p>

        <Link
          to="/login"
          className="block text-center text-cyan-400 font-semibold mt-2 hover:underline"
        >

          Login Here

        </Link>

      </form>

    </div>

  );

}

export default Register;