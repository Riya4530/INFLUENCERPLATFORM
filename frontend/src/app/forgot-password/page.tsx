"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      const response = await fetch(
        "http://localhost:5000/api/forgot-password",
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            newPassword,
          }),
        }
      );

      const data =
        await response.json();

      setMessage(data.message);

    } catch (error) {

      setMessage(
        "Something went wrong"
      );

    }

  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-6">

      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">

        <h1 className="text-4xl font-bold mb-6 text-center">
          Forgot Password
        </h1>

        <form
          onSubmit={handleReset}
          className="space-y-4"
        >

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full border p-4 rounded-xl"
            required
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(
                e.target.value
              )
            }
            className="w-full border p-4 rounded-xl"
            required
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-4 rounded-xl font-semibold"
          >
            Reset Password
          </button>

        </form>

        {message && (
          <p className="mt-4 text-center">
            {message}
          </p>
        )}

      </div>

    </main>
  );
}