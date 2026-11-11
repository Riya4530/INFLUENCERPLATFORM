"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (
      storedUser &&
      storedUser !== "undefined"
    ) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);

        if (parsed.email) {
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/${parsed.email}`)
            .then((res) => res.json())
            .then((data) => {
              if (data.success && data.profile?.image) {
                setProfileImage(data.profile.image);
              }
            })
            .catch(() => {});
        }
      } catch (error) {
        console.log("Invalid user data", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
  <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm">
    
    <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-4">

      {/* LOGO */}
      <a href="/" className="text-xl md:text-3xl font-extrabold text-black tracking-tight">
        Influencer Platform
      </a>

      {/* NAV LINKS */}
      <div className="hidden md:flex items-center gap-7 text-gray-700 font-medium">

        <a href="/" className="hover:text-black transition">Home</a>
        <a href="/influencers" className="hover:text-black transition">Influencers</a>
        <a href="/about-us" className="hover:text-black transition">About</a>
        <a href="/contact-us" className="hover:text-black transition">Contact</a>

        {user ? (
          <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
            <a
              href={
                user?.role === "admin"
                  ? "/admin"
                  : user?.role === "brand"
                  ? "/brand"
                  : "/dashboard"
              }
              className="flex items-center gap-2.5 font-semibold text-black hover:opacity-80 transition"
            >
              <img
                src={profileImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border border-gray-300"
              />
              <span>Dashboard</span>
            </a>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-xl transition shadow-sm"
            >
              Logout
            </button>
          </div>
        ) : (
          <a
            href="/signup"
            className="bg-black text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition font-semibold"
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
