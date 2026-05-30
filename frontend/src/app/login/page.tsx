"use client";

import { useState } from "react";

export default function LoginPage() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      const response = await fetch(
        "http://localhost:5000/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data =
        await response.json();

      alert(data.message);

      if (data.success) {

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        /* =========================
           ROLE BASED REDIRECT
        ========================= */

        if (
          data.user.role === "admin"
        ) {

          window.location.href =
            "/admin";

        } else {

          window.location.href =
            "/dashboard";

        }

      }

    } catch (error) {

      console.log(error);

      alert(
        "Something went wrong"
      );

    }

  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">

      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl border border-gray-200">

        <div className="text-center mb-10">

          <h1 className="text-4xl font-bold mb-3">
            Welcome Back
          </h1>

          <p className="text-gray-500">
            Login to your account
          </p>

        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-6"
        >

          <div>

            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black"
              required
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black"
              required
            />

          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-4 rounded-2xl font-semibold hover:opacity-90 transition"
          >
            Login
          </button>

        </form>

        <p className="text-center text-gray-500 mt-8">

          Don’t have an account?{" "}

          <a
            href="/signup"
            className="text-black font-semibold"
          >
            Signup
          </a>

        </p>

      </div>

    </main>
  );
}