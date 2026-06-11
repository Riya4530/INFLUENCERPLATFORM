"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {

  const router = useRouter();

  const [search, setSearch] =
    useState("");

  const [recentSearches, setRecentSearches] =
    useState<any[]>([]);

  useEffect(() => {

    const saved = JSON.parse(
      localStorage.getItem(
        "recentSeoSearches"
      ) || "[]"
    );

    setRecentSearches(saved);

  }, []);

  const handleSearch = async () => {

    try {

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/search-data`
      );

      const data =
        await response.json();

      const cities =
        data.cities.map(
          (item: any) =>
            item.city.toLowerCase()
        );

      const categories =
        data.categories.map(
          (item: any) =>
            item.category.toLowerCase()
        );

      const text =
        search.toLowerCase();

      let foundCity = "";
      let foundCategory = "";

      cities.forEach((city: string) => {

        if (text.includes(city)) {
          foundCity = city;
        }

      });

      categories.forEach(
        (category: string) => {

          if (
            text.includes(category)
          ) {
            foundCategory =
              category;
          }

        }
      );

      if (
        !foundCity ||
        !foundCategory
      ) {

        alert(
          "Try: Food Influencers in Mumbai"
        );

        return;

      }

      const newSearch = {
        city: foundCity,
        category: foundCategory,
        label:
          `${foundCategory.charAt(0).toUpperCase() +
            foundCategory.slice(1)} Influencers in ${
            foundCity.charAt(0).toUpperCase() +
            foundCity.slice(1)
          }`,
      };

      let searches = JSON.parse(
        localStorage.getItem(
          "recentSeoSearches"
        ) || "[]"
      );

      searches = searches.filter(
        (item: any) =>
          !(
            item.city === foundCity &&
            item.category ===
              foundCategory
          )
      );

      searches.unshift(newSearch);

      searches = searches.slice(0, 5);

      localStorage.setItem(
        "recentSeoSearches",
        JSON.stringify(searches)
      );

      setRecentSearches(searches);

      router.push(
        `/discover/${foundCity}/${foundCategory}`
      );

    } catch (error) {

      console.log(error);

      alert("Search failed");

    }

  };

  return (

    <div className="w-full">

      <div className="max-w-3xl mx-auto flex gap-3">

        <input
          type="text"
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          placeholder="Food Influencers in Mumbai"
          className="flex-1 border border-gray-300 rounded-2xl px-6 py-4 outline-none focus:border-black"
        />

        <button
          onClick={handleSearch}
          className="bg-black text-white px-8 rounded-2xl font-semibold"
        >
          Search
        </button>

      </div>

      {recentSearches.length > 0 && (

        <div className="max-w-3xl mx-auto mt-6">

          <h3 className="font-semibold mb-3">
            Recent Searches
          </h3>

          <div className="flex flex-wrap gap-3">

            {recentSearches.map(
              (
                item,
                index
              ) => (

                <button
                  key={index}
                  onClick={() =>
                    router.push(
                      `/discover/${item.city}/${item.category}`
                    )
                  }
                  className="border px-4 py-2 rounded-xl hover:bg-black hover:text-white transition"
                >
                  {item.label}
                </button>

              )
            )}

          </div>

        </div>

      )}

    </div>

  );

}