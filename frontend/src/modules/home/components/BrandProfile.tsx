"use client";

import {
  useEffect,
  useState,
} from "react";

export default function BrandProfile() {

  const [companyName, setCompanyName] =
    useState("");

  const [industry, setIndustry] =
    useState("");

  const [website, setWebsite] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [logo, setLogo] =
    useState("");

  const [description, setDescription] =
    useState("");

  useEffect(() => {

    fetchProfile();

  }, []);

  const fetchProfile = async () => {

    try {

      const user =
        JSON.parse(
          localStorage.getItem("user") || "{}"
        );

      const response =
        await fetch(
          `http://localhost:5000/api/brand-profile/${user.email}`
        );

      const data =
        await response.json();

      if (
        data.success &&
        data.profile
      ) {

        setCompanyName(
          data.profile.company_name || ""
        );

        setIndustry(
          data.profile.industry || ""
        );

        setWebsite(
          data.profile.website || ""
        );

        setLocation(
          data.profile.location || ""
        );

        setLogo(
          data.profile.logo || ""
        );

        setDescription(
          data.profile.description || ""
        );

      }

    } catch (error) {

      console.log(error);

    }

  };

  const handleSave = async () => {

    try {

      const user =
        JSON.parse(
          localStorage.getItem("user") || "{}"
        );

      const checkResponse =
        await fetch(
          `http://localhost:5000/api/brand-profile/${user.email}`
        );

      const checkData =
        await checkResponse.json();

      const url =
        checkData.success
          ? `http://localhost:5000/api/update-brand-profile/${user.email}`
          : "http://localhost:5000/api/create-brand-profile";

      const method =
        checkData.success
          ? "PUT"
          : "POST";

      const response =
        await fetch(
          url,
          {
            method,

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              user_email:
                user.email,

              company_name:
                companyName,

              industry,

              website,

              location,

              logo,

              description,

            }),

          }
        );

      const data =
        await response.json();

      if (data.success) {

        alert(
          checkData.success
            ? "Profile Updated Successfully"
            : "Profile Created Successfully"
        );

      } else {

        alert(
          "Failed to save profile"
        );

      }

    } catch (error) {

      console.log(error);

      alert(
        "Something went wrong"
      );

    }

  };

  return (

    <div className="bg-white rounded-3xl p-10 shadow">

      <h2 className="text-4xl font-bold mb-8">
        Company Profile
      </h2>

      <div className="space-y-6">

        <input
          type="text"
          placeholder="Company Name"
          value={companyName}
          onChange={(e) =>
            setCompanyName(
              e.target.value
            )
          }
          className="w-full border rounded-2xl px-5 py-4"
        />

        <input
          type="text"
          placeholder="Industry"
          value={industry}
          onChange={(e) =>
            setIndustry(
              e.target.value
            )
          }
          className="w-full border rounded-2xl px-5 py-4"
        />

        <input
          type="text"
          placeholder="Website"
          value={website}
          onChange={(e) =>
            setWebsite(
              e.target.value
            )
          }
          className="w-full border rounded-2xl px-5 py-4"
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) =>
            setLocation(
              e.target.value
            )
          }
          className="w-full border rounded-2xl px-5 py-4"
        />

        <input
          type="text"
          placeholder="Logo URL"
          value={logo}
          onChange={(e) =>
            setLogo(
              e.target.value
            )
          }
          className="w-full border rounded-2xl px-5 py-4"
        />

        <textarea
          rows={5}
          placeholder="Company Description"
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
          className="w-full border rounded-2xl px-5 py-4"
        />

        <button
          onClick={handleSave}
          className="bg-black text-white px-8 py-4 rounded-2xl font-semibold"
        >
          Save Profile
        </button>

 <div className="mt-10 border-t pt-8">

  <h3 className="text-2xl font-bold mb-6">
    Profile Preview
  </h3>

  <div className="bg-gray-50 rounded-3xl p-8">

    {logo && (

      <img
        src={logo}
        alt="Logo"
        className="w-24 h-24 rounded-2xl object-cover mb-4"
      />

    )}

    <h2 className="text-3xl font-bold">
      {companyName || "Company Name"}
    </h2>

    <p className="text-gray-500 mt-2">
      {industry || "Industry"}
    </p>

    <p className="mt-3">
      📍 {location || "Location"}
    </p>

   {website ? (
  <a
    href={website}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 block mt-3"
  >
    {website}
  </a>
) : (
  <p className="mt-3 text-gray-500">
    Website
  </p>
)}

    <p className="mt-5 text-gray-700">
      {description ||
        "Company description will appear here."}
    </p>

  </div>

</div>
      </div>

 </div>

  );

}