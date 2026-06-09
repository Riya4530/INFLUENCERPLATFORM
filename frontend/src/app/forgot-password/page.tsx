"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    if (newPassword !== confirmPassword) {

      setMessage(
        "Passwords do not match"
      );

      return;

    }

    try {

      setLoading(true);

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

      if (data.success) {

        setTimeout(() => {

          router.push("/login");

        }, 2000);

      }

    } catch (error) {

      console.log(error);

      setMessage(
        "Something went wrong"
      );

    } finally {

      setLoading(false);

    }

  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">

      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl border border-gray-200">

        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold mb-3">
            Reset Password
          </h1>

          <p className="text-gray-500">
            Enter your email and create a new password
          </p>

        </div>

        <form
          onSubmit={handleReset}
          className="space-y-5"
        >

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black"
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
            className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black"
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-2xl font-semibold hover:opacity-90 transition"
          >
            {loading
              ? "Updating..."
              : "Reset Password"}
          </button>

        </form>

        {message && (

          <p
            className={`mt-6 text-center font-medium ${
              message.includes(
                "success"
              )
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {message}
          </p>

        )}

      </div>

    </main>
  );
}