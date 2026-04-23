import { Link } from "react-router";

export default function Navbar() {
  return (
    <nav className="md:px-[50px] px-2 py-3 shadow-md bg-gradient-to-r from-green-500 to-emerald-600 text-white ">
      <div className="flex items-center justify-between">
        <h1>
          <Link to="/form" className="text-white font-semibold text-4xl">
            Dansco-Tech
          </Link>
        </h1>

        <button>
          <Link
            to="/login"
            className="max-w-[150px] w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
              font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Admin
          </Link>
        </button>
      </div>
    </nav>
  );
}
