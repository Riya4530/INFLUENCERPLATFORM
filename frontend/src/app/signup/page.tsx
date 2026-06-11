"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("influencer");

  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let url = "";

      // ROLE-BASED SIGNUP ROUTE
      if (role === "brand") {
        url = `${process.env.NEXT_PUBLIC_API_URL}/api/brands/signup`;
      } else {
        url = `${process.env.NEXT_PUBLIC_API_URL}/api/signup`;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      const data = await response.json();

      // ❌ FAILED SIGNUP
      if (!data.success) {
        alert(data.message || "Signup failed");
        return;
      }

      // 🧠 STORE USER INFO
      localStorage.setItem(
        "user",
        JSON.stringify({
          role: role,
          user: data.user || data.brand,
        })
      );

      alert("Signup successful!");

      // 🚀 ROLE BASED REDIRECT
      if (role === "brand") {
        router.push("/brand");
      } else {
        router.push("/dashboard");
      }

    } catch (error) {
      console.log(error);
      alert("Could not connect to server");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-10">

      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl border border-gray-200">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">
            Create Account
          </h1>
          <p className="text-gray-500">
            Join the influencer marketplace
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSignup} className="space-y-6">

          {/* NAME */}
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-4 rounded-2xl"
            required
          />

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-4 rounded-2xl"
            required
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-4 rounded-2xl"
            required
          />

          {/* ROLE SELECT */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border p-4 rounded-2xl"
          >
            <option value="influencer">Influencer</option>
            <option value="brand">Brand</option>
          </select>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full bg-black text-white py-4 rounded-2xl"
          >
            Sign Up
          </button>

        </form>

        {/* LOGIN LINK */}
        <p className="text-center text-gray-500 mt-8">
          Already have an account?{" "}
          <a href="/login" className="text-black font-semibold">
            Login
          </a>
        </p>

      </div>
    </main>
  );
}