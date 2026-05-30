"use client";

import { useEffect, useState } from "react";

export default function Navbar() {

  const [user, setUser] = useState<any>(null);

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

  }, []);

  const handleLogout = () => {

    localStorage.removeItem("user");

    window.location.href = "/";
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">

      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        <h1 className="text-3xl font-extrabold text-black tracking-tight">
          Influencer Platform
        </h1>

        <div className="flex items-center gap-8 text-gray-700 font-medium">

          <a
            href="/"
            className="relative group text-lg"
          >
            Home

            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
          </a>

          <a
            href="/influencers"
            className="relative group text-lg"
          >
            Influencers

            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
          </a>

          <a
            href="/about-us"
            className="relative group text-lg"
          >
            About

            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
          </a>

          <a
            href="/contact-us"
            className="relative group text-lg"
          >
            Contact

            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
          </a>

          {
            user ? (

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-6 py-3 rounded-2xl hover:scale-105 hover:opacity-90 transition duration-300 font-semibold"
              >
                Logout
              </button>

            ) : (

              <a
                href="/login"
                className="bg-black text-white px-6 py-3 rounded-2xl hover:scale-105 hover:opacity-90 transition duration-300 font-semibold"
              >
                Login
              </a>

            )
          }

        </div>

      </div>

    </nav>
  );
}