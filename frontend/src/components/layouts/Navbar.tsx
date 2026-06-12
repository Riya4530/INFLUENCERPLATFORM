"use client";

import { useEffect, useState } from "react";

export default function Navbar() {

  const [user, setUser] = useState<any>(null);

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");

    if (
      storedUser &&
      storedUser !== "undefined"
    ) {

      try {

        setUser(
          JSON.parse(storedUser)
        );

      } catch (error) {

        console.log(
          "Invalid user data",
          error
        );

        localStorage.removeItem(
          "user"
        );

      }

    }

  }, []);

  const handleLogout = () => {

    localStorage.removeItem("user");

    window.location.href = "/";
  };

  return (
  <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
    
    <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-4">

      {/* LOGO */}
      <h1 className="text-xl md:text-3xl font-extrabold text-black tracking-tight">
        Influencer Platform
      </h1>

      {/* NAV LINKS */}
      <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">

        <a href="/" className="hover:text-black transition">Home</a>
        <a href="/influencers" className="hover:text-black transition">Influencers</a>
        <a href="/about-us" className="hover:text-black transition">About</a>
        <a href="/contact-us" className="hover:text-black transition">Contact</a>

        {user ? (
          <>
            <a
              href={
                user?.role === "admin"
                  ? "/admin"
                  : user?.role === "brand"
                  ? "/brand"
                  : "/dashboard"
              }
              className="hover:text-black transition"
            >
              Dashboard
            </a>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-xl hover:opacity-90 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <a
            href="/signup"
            className="bg-black text-white px-4 py-2 rounded-xl hover:opacity-90 transition"
          >
            Get Started
          </a>
        )}
      </div>

      {/* MOBILE BUTTON (simple fallback) */}
      <div className="md:hidden">
        <a
          href="/signup"
          className="bg-black text-white px-4 py-2 rounded-xl"
        >
          Menu
        </a>
      </div>

    </div>
  </nav>
);
}
