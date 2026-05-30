"use client";

import { useState } from "react";

export default function ContactPage() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      const response = await fetch(
        "http://localhost:5000/api/contact",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            subject,
            message,
          }),
        }
      );

      const data =
        await response.json();

      alert(data.message);

      if (data.success) {

        setName("");
        setEmail("");
        setSubject("");
        setMessage("");

      }

    } catch (error) {

      console.log(error);

      alert("Something went wrong");

    }

  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-white">

      {/* HERO SECTION */}

      <section className="max-w-7xl mx-auto px-6 py-24">

        <div className="text-center mb-20">

          <p className="text-pink-600 font-semibold text-lg mb-4">
            CONTACT US
          </p>

          <h1 className="text-6xl font-bold mb-6">
            Let’s Connect
          </h1>

          <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
            Have questions about collaborations, influencer partnerships,
            or platform support? We would love to hear from you.
          </p>

        </div>

        <div className="grid md:grid-cols-2 gap-14 items-start">

          {/* LEFT SIDE */}

          <div className="space-y-8">

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:-translate-y-2 transition">

              <div className="text-5xl mb-5">
                📧
              </div>

              <h2 className="text-3xl font-bold mb-3">
                Email Support
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed">
                Reach out to our support team for any platform related
                queries or collaboration opportunities.
              </p>

              <p className="mt-4 font-semibold text-pink-600 text-lg">
                support@influencerplatform.com
              </p>

            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:-translate-y-2 transition">

              <div className="text-5xl mb-5">
                🌍
              </div>

              <h2 className="text-3xl font-bold mb-3">
                Our Mission
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed">
                We aim to build a modern influencer marketplace where
                creators and brands can connect professionally and grow
                together.
              </p>

            </div>

            <div className="bg-black text-white p-8 rounded-3xl shadow-lg">

              <h2 className="text-3xl font-bold mb-4">
                Why Choose Us?
              </h2>

              <ul className="space-y-4 text-lg text-gray-300">

                <li>
                  ✔ Professional influencer profiles
                </li>

                <li>
                  ✔ Easy brand collaborations
                </li>

                <li>
                  ✔ Modern and user-friendly platform
                </li>

                <li>
                  ✔ Secure and scalable system
                </li>

              </ul>

            </div>

          </div>

          {/* RIGHT SIDE FORM */}

          <div className="bg-white p-10 rounded-3xl shadow-xl">

            <h2 className="text-4xl font-bold mb-8">
              Send Us a Message
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              <div>

                <label className="block mb-3 font-semibold">
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
                  required
                />

              </div>

              <div>

                <label className="block mb-3 font-semibold">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black"
                  required
                />

              </div>

              <div>

                <label className="block mb-3 font-semibold">
                  Subject
                </label>

                <input
                  type="text"
                  placeholder="Enter subject"
                  value={subject}
                  onChange={(e) =>
                    setSubject(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black"
                  required
                />

              </div>

              <div>

                <label className="block mb-3 font-semibold">
                  Message
                </label>

                <textarea
                  rows={6}
                  placeholder="Write your message..."
                  value={message}
                  onChange={(e) =>
                    setMessage(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black"
                  required
                ></textarea>

              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-4 rounded-2xl font-semibold hover:scale-105 transition"
              >
                Send Message
              </button>

            </form>

          </div>

        </div>

      </section>

    </main>
  );
}