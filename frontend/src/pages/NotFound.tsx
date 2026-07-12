import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center">

      <h1 className="text-8xl font-bold text-red-500">
        404
      </h1>

      <p className="mt-5">
        Page Not Found
      </p>

      <Link
        to="/"
        className="mt-8 text-cyan-400"
      >
        Go Home
      </Link>

    </div>
  );
}

export default NotFound;