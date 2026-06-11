"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data = await response.json();

      // fallback to brand login
      if (!data.success) {
        response = await fetch("http://localhost:5000/api/brands/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        data = await response.json();
      }

      if (!data.success) {
        alert(data.message || "Login failed");
        return;
      }

      // ✅ FIX: extract user + role properly
      const user = data.user || data.brand || data;
      const role = user.role;

      if (!role) {
        alert("Role not found from server");
        return;
      }

      // ✅ STORE CLEAN USER OBJECT (IMPORTANT FIX)
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          role,
        })
      );

      alert("Login successful");

      // ✅ CORRECT REDIRECTS
      if (role === "admin") {
        router.push("/admin");
      } 
      else if (role === "brand") {
        router.push("/brand");
      } 
      else {
        router.push("/dashboard"); // influencer dashboard
      }

    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl border border-gray-200">

        <h1 className="text-4xl font-bold text-center mb-3">
          Welcome Back
        </h1>

        <p className="text-center text-gray-500 mb-10">
          Login to your account
        </p>

        <form onSubmit={handleLogin} className="space-y-6">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-4 rounded-xl"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-4 rounded-xl"
            required
          />
          <div className="text-right">

  <a
    href="/forgot-password"
    className="text-sm text-gray-500 hover:text-black"
  >
    Forgot Password?
  </a>

</div>

          <button
            type="submit"
            className="w-full bg-black text-white py-4 rounded-xl"
          >
            Login
          </button>

        </form>
  <p className="text-center text-gray-500 mt-8">
          Don't have an account?{" "}
          <a href="/signup" className="text-black font-semibold">
            Sign Up
          </a>
        </p>
      </div>
    </main>
  );
}