import React, { useState } from "react";
import { Link, useNavigate } from 'react-router'; 
import { IoIosEye, IoIosEyeOff } from "react-icons/io"; 
import { useAuthStore } from "../store/store";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
const {signup , isLoading} = useAuthStore();
const navigate = useNavigate();
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password);
      setPassword('')
      setEmail('')
      navigate('/login')
    } catch (err) {
      console.log(err,'error in the register file');
      
    }
  };

  const togglePasswordVisibility = () => {
    setShowPass(!showPass);
  };

  const handleGoogleSignUp = async () => {
    try {
      // await signInWithPopup(auth, googleProvider);
    } catch (err) {
         console.log(err,'error in the register file in the google button');
    }
  };

  return (
    <div
     className="max-w-md mx-auto p-6 py-3 px-4 bg-gradient-to-r from-green-800 to-emerald-900 text-white 
              font-bold rounded-lg shadow-lg my-20"
    >
      <h2 className="text-2xl font-bold text-center mb-6 text-white">
        Create an Account
      </h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-white mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-2 border border-gray-300  rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-transparent"
            required
          />
        </div>

        <div className="relative">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-white mb-1"
          >
            Password
          </label>
          <input
            type={showPass ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-2 border border-gray-300 bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 "
            required
            minLength="6"
          />
          <div
            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            onClick={togglePasswordVisibility}
          >
            {showPass ? <IoIosEyeOff size={25} /> : <IoIosEye size={25} />}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
              font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          // className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
        >
          {isLoading? " creating...": "Register"}
        </button>
      </form>

      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-orange-300"></div>
        <span className="mx-4 text-gray-500">OR</span>
        <div className="flex-grow border-t border-orange-300"></div>
      </div>

      <button
        onClick={handleGoogleSignUp}
        className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 border border-gray-300 rounded-md shadow-sm transition duration-200"
      >
        <svg
          className="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Sign up with Google
      </button>

      <p className="mt-6 text-xs text-white text-center">
        By registering, you agree to our{" "}
        <a href="/terms" className="text-blue-600 hover:underline">
          Terms and Conditions
        </a>{" "}
        and{" "}
        <a href="/privacy" className="text-blue-600 hover:underline">
          Privacy Policy
        </a>
      </p>

      <p className="mt-4 text-center text-sm text-white">
        Already have an account
        <Link to="/login" className="text-green-500 hover:underline ml-2">
          Login
        </Link>
      </p>
    </div>
  );
}
