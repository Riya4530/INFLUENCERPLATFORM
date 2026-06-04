"use client";

import { useEffect, useState } from "react";
import InfluencerCard from "@/modules/home/components/InfluencerCard";

export default function InfluencersPage() {

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [followersFilter, setFollowersFilter] =
  useState("All");
  const [cityFilter, setCityFilter] =
  useState("All");
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [savedSearches, setSavedSearches] =
    useState<any[]>([]);

  useEffect(() => {

    fetch("http://localhost:5000/api/influencers")
      .then((res) => res.json())
      .then((data) => {

        const list =
          data.influencers || data;

        setInfluencers(list || []);

      });

    const searches = JSON.parse(
      localStorage.getItem("savedSearches") || "[]"
    );

    setSavedSearches(searches);

  }, []);

  const filteredInfluencers =
  influencers.filter(
    (influencer: any) => {

      const matchesSearch =
        influencer.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesCategory =
        category === "All" ||
        influencer.category === category;

      const followers =
        Number(
          influencer.followers || 0
        );

        const matchesCity =
  cityFilter === "All" ||
  influencer.city?.toLowerCase() ===
    cityFilter.toLowerCase();
    
      let matchesFollowers = true;

      if (
        followersFilter ===
        "0-10000"
      ) {
        matchesFollowers =
          followers <= 10000;
      }

      if (
        followersFilter ===
        "10000-50000"
      ) {
        matchesFollowers =
          followers > 10000 &&
          followers <= 50000;
      }

      if (
        followersFilter ===
        "50000-100000"
      ) {
        matchesFollowers =
          followers > 50000 &&
          followers <= 100000;
      }

      if (
        followersFilter ===
        "100000+"
      ) {
        matchesFollowers =
          followers > 100000;
      }
return (
  matchesSearch &&
  matchesCategory &&
  matchesFollowers &&
  matchesCity
);
    }
  );

  const saveCurrentSearch = () => {

    const newSearch = {
  search,
  category,
  followersFilter,
  cityFilter,
};

    let searches = JSON.parse(
      localStorage.getItem("savedSearches") || "[]"
    );

    searches.push(newSearch);

    localStorage.setItem(
      "savedSearches",
      JSON.stringify(searches)
    );

    setSavedSearches(searches);

    alert("Search Saved!");

  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-20">

      <div className="mb-14">

        <h1 className="text-6xl font-bold mb-4">
          Explore Influencers
        </h1>

        <p className="text-xl text-gray-600">
          Discover creators across multiple categories.
        </p>

      </div>

      {/* SEARCH + FILTER */}

      {/* SEARCH + FILTER */}

<div className="flex flex-col md:flex-row gap-6 mb-14">

  <input
    type="text"
    placeholder="Search influencers..."
    value={search}
    onChange={(e) =>
      setSearch(e.target.value)
    }
    className="flex-1 border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black"
  />

  {/* CATEGORY FILTER */}
  <select
    value={category}
    onChange={(e) =>
      setCategory(e.target.value)
    }
    className="border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black"
  >
    <option value="All">
      All Categories
    </option>

    <option value="Food">
      Food
    </option>

    <option value="Fashion">
      Fashion
    </option>

    <option value="Tech">
      Tech
    </option>

    <option value="Lifestyle">
      Lifestyle
    </option>
  </select>

  {/* FOLLOWERS FILTER */}
  <select
    value={followersFilter}
    onChange={(e) =>
      setFollowersFilter(e.target.value)
    }
    className="border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black"
  >
    <option value="All">
      All Followers
    </option>

    <option value="0-10000">
      0 - 10K
    </option>

    <option value="10000-50000">
      10K - 50K
    </option>

    <option value="50000-100000">
      50K - 100K
    </option>

    <option value="100000+">
      100K+
    </option>
  </select>

  <select
  value={cityFilter}
  onChange={(e) =>
    setCityFilter(e.target.value)
  }
  className="border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black"
>

  <option value="All">
    All Cities
  </option>

  <option value="Ahmedabad">
    Ahmedabad
  </option>

  <option value="Surat">
    Surat
  </option>

  <option value="Mumbai">
    Mumbai
  </option>

  <option value="Delhi">
    Delhi
  </option>

</select>

  <button
    onClick={saveCurrentSearch}
    className="bg-black text-white px-6 py-4 rounded-2xl"
  >
    Save Search
  </button>

</div>

      {/* SAVED SEARCHES */}

{savedSearches.length > 0 && (

  <div className="mb-10">

    <h2 className="text-2xl font-bold mb-4">
      Saved Searches
    </h2>

    <div className="flex flex-wrap gap-3">

      {savedSearches.map(
        (item, index) => (

          <button
            key={index}
            onClick={() => {

              setSearch(item.search);

              setCategory(item.category);

              setFollowersFilter(
                item.followersFilter || "All"
              );

              setCityFilter(
                item.cityFilter || "All"
              );

            }}
            className="border px-4 py-2 rounded-xl hover:bg-black hover:text-white transition"
          >
            {item.search || "All"} • {item.category}
          </button>

        )
      )}

    </div>

  </div>

)}

      {/* INFLUENCERS GRID */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

        {filteredInfluencers.map(
          (influencer: any) => (

            <InfluencerCard
              key={influencer.id}
              id={influencer.id}
              name={influencer.name}
              category={influencer.category}
              followers={influencer.followers}
              city={influencer.city}
              instagram={influencer.instagram}
              image={influencer.image}
            />

          )
        )}

      </div>

    </main>
  );
}