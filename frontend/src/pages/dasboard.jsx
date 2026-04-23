import { Link } from "react-router";

export default function Dashboard() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url('/bg.webp')`,
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-white">
        <div className="text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Welcome to{" "}
            <span className="text-orange-600 uppercase text-5xl">Dansco</span>{" "}
            <span className="text-orange-800  text-5xl -ml-5 uppercase">
              labs{" "}
            </span>{" "}
            tech
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Your oppurtunity to become a software engineer starts here! Why not
            register for our bootcamp and get started on your journey?{" "}
          </p>
          <div className="flex  gap-4 justify-center">
            <button
              className="max-w-[200px] w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
              font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <Link to="/form">Get Started</Link>
            </button>

            <button
              className="max-w-[190px] w-full    bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
              disabled={true}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
