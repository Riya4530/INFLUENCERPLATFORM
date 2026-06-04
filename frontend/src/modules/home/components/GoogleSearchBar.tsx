"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

const cities = ["mumbai", "surat", "ahmedabad", "delhi", "pune"];
const categories = ["food", "fashion", "travel", "tech", "fitness", "lifestyle"];

export default function GoogleSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);

  // 🔍 generate suggestions
  const suggestions = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();

    const cityMatches = cities
      .filter((c) => c.includes(q))
      .map((c) => ({ type: "city", value: c }));

    const categoryMatches = categories
      .filter((c) => c.includes(q))
      .map((c) => ({ type: "category", value: c }));

    return [...cityMatches, ...categoryMatches].slice(0, 6);
  }, [query]);

  // 🚀 routing logic
  const handleSelect = (value: string, type?: string) => {
    let url = "/discover";

    if (type === "city") {
      url = `/discover/${value}`;
    } else if (type === "category") {
      url = `/discover/all/${value}`;
    } else {
      url = `/discover?search=${encodeURIComponent(value)}`;
    }

    router.push(url);
    setOpen(false);
    setQuery(value);
  };

  // ⌨️ keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;

    if (e.key === "ArrowDown") {
      setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    }

    if (e.key === "ArrowUp") {
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    }

    if (e.key === "Enter") {
      if (activeIndex >= 0) {
        const item = suggestions[activeIndex];
        handleSelect(item.value, item.type);
      } else {
        handleSelect(query);
      }
    }
  };

  // click outside close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={boxRef} className="relative w-full max-w-2xl mx-auto mt-10">

      {/* INPUT */}
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActiveIndex(-1);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => setOpen(true)}
        placeholder="Search city or category..."
        className="w-full px-6 py-4 rounded-full border border-gray-300 shadow-md
                   focus:outline-none focus:ring-2 focus:ring-black text-lg"
      />

      {/* DROPDOWN */}
      {open && suggestions.length > 0 && (
        <div className="absolute w-full bg-white mt-2 rounded-2xl shadow-xl border overflow-hidden z-50">

          {suggestions.map((item, index) => (
            <div
              key={`${item.type}-${item.value}`}
              onClick={() => handleSelect(item.value, item.type)}
              className={`px-5 py-3 cursor-pointer flex justify-between
                ${index === activeIndex ? "bg-gray-100" : "hover:bg-gray-50"}`}
            >
              <span className="capitalize">{item.value}</span>
              <span className="text-xs text-gray-400">{item.type}</span>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}