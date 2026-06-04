"use client";

import { useState } from "react";

export default function CreateCampaign() {
  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        budget,
        category,
      }),
    });

    const data = await res.json();
    console.log(data);

    alert("Campaign Created!");
  };

  return (
    <div>
      <h1>Create Campaign</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
        
        <input
          placeholder="Campaign Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />

        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <button type="submit">Create Campaign</button>
      </form>
    </div>
  );
}