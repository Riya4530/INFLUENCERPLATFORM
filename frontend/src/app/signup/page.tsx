"use client";

import { useState } from "react";

export default function SignupPage() {

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [role, setRole] =
    useState("influencer");

  const handleSignup = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    const response = await fetch(
      "http://localhost:5000/api/signup",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      }
    );

    const data =
      await response.json();

    alert(data.message);

    if (data.success) {

      window.location.href =
        "/login";

    }

  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-10">

      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl border border-gray-200">

        <div className="text-center mb-10">

          <h1 className="text-4xl font-bold mb-3">
            Create Account
          </h1>

          <p className="text-gray-500">
            Join the influencer marketplace
          </p>

        </div>

        <form
          onSubmit={handleSignup}
          className="space-y-6"
        >

          <div>

            <label className="block mb-2 font-medium">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black"
            />

          </div>

          {/* ROLE SELECT */}

          <div>

            <label className="block mb-2 font-medium">
              Select Role
            </label>

            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value)
              }
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black"
            >

              <option value="influencer">
                Influencer
              </option>

              <option value="brand">
                Brand
              </option>

            </select>

          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-4 rounded-2xl font-semibold hover:opacity-90 transition"
          >
            Create Account
          </button>

        </form>

        <p className="text-center text-gray-500 mt-8">

          Already have an account?{" "}

          <a
            href="/login"
            className="text-black font-semibold"
          >
            Login
          </a>

        </p>

      </div>

    </main>
  );
}