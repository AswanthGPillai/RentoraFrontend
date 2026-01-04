import React from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <div className="flex h-screen">
      
      {/* LEFT SECTION */}
      <div
        className="hidden md:flex w-3/5 bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c)",
        }}
      >
        <div className="absolute inset-0 bg-black/40 p-10 text-white">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <span>🏠</span>
            <span>Rentora</span>
          </div>

          <h1 className="mt-32 text-5xl font-bold leading-tight">
            Welcome Home! <br />
            Find your perfect rental.
          </h1>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full md:w-2/5 flex items-center justify-center bg-gradient-to-br from-gray-100 to-white">
        <div className="bg-white w-[380px] p-10 rounded-2xl shadow-xl">
          
          <h2 className="text-3xl font-bold mb-6">Sign Up</h2>

          <input
            type="text"
            placeholder="Username"
            className="w-full px-5 py-3 mb-4 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-5 py-3 mb-4 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="relative mb-4">
            <input
              type="password"
              placeholder="Password"
              className="w-full px-5 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute right-4 top-3 text-gray-400 cursor-pointer">
              👁
            </span>
          </div>

          <button className="w-full py-3 mt-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition">
            Create Account
          </button>

          <p className="text-center text-sm mt-5">
            Already have an account?
            <Link to="/login" >
              <span className="text-blue-600 font-medium">
                Log in
              </span>
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
};


export default SignUp;
