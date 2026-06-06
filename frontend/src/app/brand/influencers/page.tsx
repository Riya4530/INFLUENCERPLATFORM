"use client";

import { useEffect, useState } from "react";
import InfluencerCard from "@/modules/home/components/InfluencerCard";

export default function BrandInfluencersPage() {

  const [influencers, setInfluencers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [followersFilter, setFollowersFilter] =
    useState("All");
  const [cityFilter, setCityFilter] =
    useState("All");

  const [savedSearches, setSavedSearches] =
    useState<any[]>([]);
  const [recommended, setRecommended] =
  useState<any[]>([]);

  const [selectedInfluencer, setSelectedInfluencer] =
    useState<any>(null);

  const [campaignId, setCampaignId] =
    useState("");
  const [campaigns, setCampaigns] =
  useState<any[]>([]);

  useEffect(() => {

    const fetchInfluencers = async () => {

      try {

        setLoading(true);

        const res = await fetch(
          "http://localhost:5000/api/influencers"
        );

        const data = await res.json();

        const list =
  data.influencers || data || [];

setInfluencers(list);

const recommendedList =
  [...list]
    .sort(
      (a, b) =>
        Number(b.followers || 0) -
        Number(a.followers || 0)
    )
    .slice(0, 3);

setRecommended(
  recommendedList
);


      } catch (error) {

        console.log(
          "Error fetching influencers:",
          error
        );

        setInfluencers([]);

      } finally {

        setLoading(false);

      }

    };

    fetchInfluencers();

    const searches = JSON.parse(
      localStorage.getItem(
        "savedSearches"
      ) || "[]"
    );

    setSavedSearches(searches);
 
    const fetchCampaigns = async () => {

  try {

    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    const response = await fetch(
      `http://localhost:5000/api/campaigns/${user.id}`
    );

    const data =
      await response.json();

    setCampaigns(
      data.campaigns || []
    );

  } catch (error) {

    console.log(
      "Campaign fetch error:",
      error
    );

  }

};

fetchCampaigns();

  }, []);

  const filteredInfluencers =
    influencers.filter(
      (influencer: any) => {

        const matchesSearch =
          influencer.name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchesCategory =
          category === "All" ||
          influencer.category === category;

        const matchesCity =
          cityFilter === "All" ||
          influencer.city === cityFilter;

        const followers =
          Number(
            influencer.followers || 0
          );

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
          matchesCity &&
          matchesFollowers
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

    const searches = JSON.parse(
      localStorage.getItem(
        "savedSearches"
      ) || "[]"
    );

    searches.push(newSearch);

    localStorage.setItem(
      "savedSearches",
      JSON.stringify(searches)
    );

    setSavedSearches(searches);

    alert("Search Saved!");

  };

  if (loading) {

    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">
          Loading influencers...
        </h1>
      </main>
    );

  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-20">

      <h1 className="text-5xl font-bold mb-10">
        Brand Influencer Discovery
      </h1>

      {/* FILTERS */}

      <div className="flex flex-col md:flex-row gap-4 mb-8">

        <input
          type="text"
          placeholder="Search Influencers"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="border rounded-xl p-3 flex-1"
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          className="border rounded-xl p-3"
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

        <select
          value={followersFilter}
          onChange={(e) =>
            setFollowersFilter(
              e.target.value
            )
          }
          className="border rounded-xl p-3"
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
            setCityFilter(
              e.target.value
            )
          }
          className="border rounded-xl p-3"
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
          className="bg-black text-white px-6 rounded-xl"
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

                    setSearch(
                      item.search
                    );

                    setCategory(
                      item.category
                    );

                    setFollowersFilter(
                      item.followersFilter ||
                      "All"
                    );

                    setCityFilter(
                      item.cityFilter ||
                      "All"
                    );

                  }}
                  className="border px-4 py-2 rounded-xl hover:bg-black hover:text-white"
                >
                  {item.search || "All"} •{" "}
                  {item.category}
                </button>

              )
            )}

          </div>

        </div>

      )}

      {/* INFLUENCERS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

       

        {filteredInfluencers.map(
          (inf: any) => (

            <div
              key={inf.id}
              className="space-y-3"
            >

              <InfluencerCard
                id={inf.id}
                name={inf.name}
                category={inf.category}
                followers={inf.followers}
                city={inf.city}
                instagram={inf.instagram}
                image={inf.image}
              />

              <div className="flex gap-2">

                <button
                  className="flex-1 bg-black text-white py-2 rounded-xl"
                  onClick={() =>
                    setSelectedInfluencer(
                      inf
                    )
                  }
                >
                  Invite
                </button>

                <button className="flex-1 border border-black py-2 rounded-xl">
                  Shortlist
                </button>

              </div>

            </div>

          )
        )}

      </div>

      {/* INVITE MODAL */}

      {selectedInfluencer && (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">

          <div className="bg-white p-6 rounded-2xl w-[400px]">

            <h2 className="text-xl font-bold mb-4">
              Invite {selectedInfluencer.name}
            </h2>

           <p className="mb-4 text-gray-600">
  Select Campaign
</p>

<select
  value={campaignId}
  onChange={(e) =>
    setCampaignId(
      e.target.value
    )
  }
  className="border p-2 w-full mb-4 rounded-lg"
>

  <option value="">
    Select Campaign
  </option>

  {campaigns.map(
    (campaign: any) => (

      <option
        key={campaign.id}
        value={campaign.id}
      >
        {campaign.title}
      </option>

    )
  )}

</select>

            <div className="flex gap-2">

              <button
                className="bg-black text-white flex-1 py-2 rounded-xl"
                onClick={async () => {

  try {

    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    console.log("USER =", user);
console.log("BRAND ID =", user?.id);
console.log("INFLUENCER ID =", selectedInfluencer?.id);

    const response = await fetch(
      "http://localhost:5000/api/invitations",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },                
        body: JSON.stringify({
          brand_id: user.id,
          influencer_id:
            selectedInfluencer.id,
          campaign_id:
            campaignId,
        }),
      }
    );

    const data =
      await response.json();

    alert(data.message);

    setSelectedInfluencer(null);
    setCampaignId("");

  } catch (error) {

    console.log(error);

    alert(
      "Failed to send invitation"
    );

  }

}}
              >
                Send Invite
              </button>

              <button
                className="border flex-1 py-2 rounded-xl"
                onClick={() =>
                  setSelectedInfluencer(
                    null
                  )
                }
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}