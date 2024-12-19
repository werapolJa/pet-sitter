import React, { useState } from "react";
import Link from "next/link";
import withAdminAuth from "@/utils/withAdminAuth";
import { Sidebar } from "@/components/admin-page/Sidebar";
import { UserDataProvider } from "@/context/adminpetowner";
import { ProfileTab } from "@/components/admin-page/ProfileTab";
import { PetsTab } from "@/components/admin-page/PetsTab";
import { ReviewsTab } from "@/components/admin-page/ReviewTab";
import LoadingPage from "@/components/Loading";
import { useUserData } from "@/context/adminpetowner";

const AdminPetownerProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"profile" | "pets" | "reviews">(
    "profile"
  );
  const { loading, error, userData } = useUserData();

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="pt-20">
          <LoadingPage />
        </div>
      );
    }

    if (error) {
      return <div className="p-10 text-red-500">Error: {error}</div>;
    }

    switch (activeTab) {
      case "profile":
        return <ProfileTab />;
      case "pets":
        return <PetsTab />;
      case "reviews":
        return <ReviewsTab />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 px-10 pt-[56px] pb-52">
        <div className="flex flex-col gap-8">
          <div className="flex items-center mb-4">
            <Link href="/admin/dashboard">
              <div className="mr-4 text-gray-400 cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </div>
            </Link>
            <h1
              className={`text-2xl font-bold text-black ${
                loading ? "text-gray-500" : ""
              }`}
            >
              {loading
                ? "Loading..."
                : userData?.full_name || "No User Name Available"}
            </h1>
          </div>
          <div className="w-full h-[700px]">
            <div className="flex space-x-4 bg-gray-100">
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-2 px-6 w-32 h-14 font-semibold rounded-t-lg ${
                  activeTab === "profile"
                    ? "bg-white text-orange-500"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab("pets")}
                className={`py-2 px-6 w-32 font-semibold rounded-t-lg ${
                  activeTab === "pets"
                    ? "bg-white text-orange-500"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                Pets
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`py-2 px-6 w-32 font-semibold rounded-t-lg ${
                  activeTab === "reviews"
                    ? "bg-white text-orange-500"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                Reviews
              </button>
            </div>

            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

const WrappedAdminPetownerProfile = () => (
  <UserDataProvider>
    <AdminPetownerProfile />
  </UserDataProvider>
);

export default withAdminAuth(WrappedAdminPetownerProfile);
