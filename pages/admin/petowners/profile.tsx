"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import withAdminAuth from "@/utils/withAdminAuth";
import { Sidebar } from "@/components/admin-page/Sidebar";

const AdminPetownerProfile = () => {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");

  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"profile" | "pets" | "reviews">(
    "profile"
  );

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString("en-GB", options);
  };

  useEffect(() => {
    if (uid) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
          const response = await fetch(`/api/admin/petownerinfo?uid=${uid}`);

          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }

          const result = await response.json();
          setUserData(result.data);
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [uid]);

  const renderTabContent = () => {
    if (loading) {
      return <div className="p-10">Loading...</div>;
    }

    if (error) {
      return <div className="p-10 text-red-500">Error: {error}</div>;
    }

    if (!userData) {
      return <div className="p-10">No data found.</div>;
    }

    switch (activeTab) {
      case "profile":
        return (
          <div className="flex p-10">
            <div className="w-60 h-60 rounded-full overflow-hidden flex-shrink-0 relative">
              <Image
                src={
                  userData.image
                    ? userData.image
                    : "https://via.placeholder.com/240"
                }
                alt="Profile"
                layout="fill"
                objectFit="cover"
                objectPosition="center"
              />
            </div>
            <div className="ml-8 space-y-4 h-[488px] bg-gray-50 w-full rounded-lg p-4">
              <div>
                <p className="text-gray-500 font-semibold">Pet Owner Name</p>
                <p className="text-lg font-bold">{userData.full_name}</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold">Email</p>
                <p>{userData.email}</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold">Phone</p>
                <p>{userData.phone}</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold">Status</p>
                <p>{userData.status}</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold">ID Number</p>
                <p>{userData.id_number}</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold">Date of Birth</p>
                <p>{formatDate(userData.birthdate)}</p>
              </div>
            </div>
          </div>
        );

      case "pets":
        return (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-4">Pets</h2>
            {userData.pets && userData.pets.length > 0 ? (
              userData.pets.map(
                (
                  pet: { pet_name: string; pet_type: string },
                  index: number
                ) => (
                  <div key={index} className="mb-4">
                    <p className="font-semibold">{pet.pet_name}</p>
                    <p className="text-gray-600">{pet.pet_type}</p>
                  </div>
                )
              )
            ) : (
              <p>No pets found for this user.</p>
            )}
          </div>
        );

      case "reviews":
        return (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-4">Reviews</h2>
            <p>Reviews section will go here.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 px-10 pt-[56px] pb-52">
        <div className="flex flex-col gap-8">
          <h1 className="text-2xl font-bold">
            {loading ? "Loading..." : userData?.full_name || "Profile"}
          </h1>
          <div className="w-full h-[700px] bg-white rounded-lg">
            <div className="flex space-x-4 bg-gray-100 rounded-lg">
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-2 px-6 w-32 h-14 font-semibold rounded-t-lg ${
                  activeTab === "profile"
                    ? "bg-white text-orange-500 "
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab("pets")}
                className={`py-2 px-6 w-32 font-semibold rounded-t-lg ${
                  activeTab === "pets"
                    ? "bg-white text-orange-500 "
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                Pets
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`py-2 px-6 w-32 font-semibold rounded-t-lg ${
                  activeTab === "reviews"
                    ? "bg-white text-orange-500 "
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                Reviews
              </button>
            </div>
            <div>{renderTabContent()}</div>
            {activeTab === "profile" && (
              <div className="flex justify-end p-6">
                <button className="text-orange-500 font-semibold hover:underline">
                  Ban This User
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAdminAuth(AdminPetownerProfile);
