"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import withAdminAuth from "@/utils/withAdminAuth";
import { Sidebar } from "@/components/admin-page/Sidebar";

const AdminPetownerProfile = () => {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");

  const [activeTab, setActiveTab] = useState<"profile" | "pets" | "reviews">(
    "profile"
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="flex p-10">
            <div className="w-60 h-60 rounded-full overflow-hidden flex-shrink-0">
              <img
                src="https://via.placeholder.com/240"
                alt="Profile"
                className="w-[240px] h-[240px] object-cover"
              />
            </div>

            <div className="ml-8 space-y-4 h-[488px] bg-gray-50 w-full rounded-lg">
              <div>
                <p className="text-gray-500 font-semibold">Pet Owner Name</p>
                <p className="text-lg font-bold">John Wick</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold">Email</p>
                <p>johnwicklovedogs@dogorg.com</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold">Phone</p>
                <p>099 996 6734</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold">ID Number</p>
                <p>1122 21 236 8654</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold">Date of Birth</p>
                <p>2 Sep 1964</p>
              </div>
            </div>
          </div>
        );
      case "pets":
        return (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-4">Pets</h2>
            <ul className="space-y-2">
              <li className="p-4 border rounded-md shadow-sm">
                <p className="font-semibold">Dog</p>
                <p>Breed: Beagle</p>
                <p>Age: 3 years</p>
              </li>
              <li className="p-4 border rounded-md shadow-sm">
                <p className="font-semibold">Cat</p>
                <p>Breed: Siamese</p>
                <p>Age: 2 years</p>
              </li>
            </ul>
          </div>
        );
      case "reviews":
        return (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-4">Reviews</h2>
            <div className="space-y-4">
              <div className="p-4 border rounded-md shadow-sm">
                <p className="font-semibold">"Great pet sitter!"</p>
                <p>- Emily R.</p>
              </div>
              <div className="p-4 border rounded-md shadow-sm">
                <p className="font-semibold">"Very professional service."</p>
                <p>- Michael T.</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 px-10 pt-[56px]">
        <div className="flex flex-col gap-8">
          <h1 className="text-2xl font-bold">John Wick</h1>
          <div className="w-full h-[700px] bg-white rounded-lg">
            {/* Tabs */}
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

            {/* Tab Content */}
            <div>{renderTabContent()}</div>

            {/* Unban Button */}
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
