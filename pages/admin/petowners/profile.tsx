// Import necessary libraries and components
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import withAdminAuth from "@/utils/withAdminAuth"; // HOC for admin authentication
import { Sidebar } from "@/components/admin-page/Sidebar"; // Sidebar component for admin page
import Link from "next/link";
import LoadingPage from "@/components/Loading";

// Define interfaces for the data types
interface Review {
  petsitter_id: string;
  petsitter_name: string;
  petsitter_image: string | null;
  rating: number;
  review_message: string;
  review_date: string;
}

interface Pet {
  pet_id: string;
  pet_image: string;
  pet_name: string;
  pet_type: string;
}

interface UserData {
  user_id: string;
  full_name: string;
  phone: string;
  id_number: string;
  image: string | null;
  birthdate: string;
  status: string;
  email: string;
  pets: Pet[]; // Array of pets owned by the user
  reviews: Review[]; // Array of reviews given by the user
}

const AdminPetownerProfile = () => {
  const searchParams = useSearchParams(); // Get query parameters from the URL
  const uid = searchParams.get("uid"); // Extract user ID from the URL parameter

  // State variables for managing user data, loading state, errors, etc.
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"profile" | "pets" | "reviews">(
    "profile"
  );
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  // Helper function to format date into a readable string
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString("en-GB", options);
  };

  // Function to fetch user data from the API
  const fetchUserData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/petownerinfo?uid=${uid}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to fetch data: ${errorData.error || response.statusText}`
        );
      }

      const result = await response.json();
      setUserData(result.data);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a pet
  function deletePet(petId: string) {
    fetch(`/api/admin/petownerinfo?uid=${uid}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ petId }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to delete pet");
        }
        alert("Pet removed successfully!");
        location.reload(); // Reload the page to refresh the pet list
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to remove the pet. Please try again.");
      });
  }

  // Fetch user data when the component is mounted or when UID changes
  useEffect(() => {
    if (uid) {
      fetchUserData();
    }
  }, [uid]);

  // Function to handle banning or unbanning a user
  const handleBanUnban = async () => {
    if (!userData) return;

    const newStatus = userData.status === "Normal" ? "Banned" : "Normal"; // Toggle the user status

    try {
      const response = await fetch(`/api/admin/petownerinfo?uid=${uid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user status");
      }

      await fetchUserData(); // Refresh user data after updating status
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setShowConfirmDialog(false);
    }
  };

  // Function to render the content based on the active tab (profile, pets, or reviews)
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

    if (!userData) {
      return <div className="p-10">No data found.</div>;
    }

    switch (activeTab) {
      case "profile":
        return (
          <div className="bg-white h-[640px] rounded-b-lg rounded-tr-lg">
            <div className="flex p-10">
              <div className="w-60 h-60 rounded-full overflow-hidden flex-shrink-0 relative">
                <Image
                  src={userData.image || "https://via.placeholder.com/240"}
                  alt="Profile"
                  layout="fill"
                  objectFit="cover"
                  objectPosition="center"
                />
              </div>
              <div className="ml-8 space-y-6 h-[488px] bg-gray-50 w-full rounded-lg p-8">
                {/* Displaying user profile information */}
                <div>
                  <p className="text-gray-400 font-bold text-xl">
                    Pet Owner Name
                  </p>
                  <p className="text-base font-normal">{userData.full_name}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-bold text-xl">Email</p>
                  <p className="text-base font-normal">{userData.email}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-bold text-xl">Phone</p>
                  <p className="text-base font-normal">{userData.phone}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-bold text-xl">Status</p>
                  <p className="text-base font-normal">{userData.status}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-bold text-xl">ID Number</p>
                  <p className="text-base font-normal">{userData.id_number}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-bold text-xl">
                    Date of Birth
                  </p>
                  <p className="text-base font-normal">
                    {formatDate(userData.birthdate)}
                  </p>
                </div>
              </div>
            </div>
            {/* Display Ban/Unban button */}
            {activeTab === "profile" && userData && (
              <div className="flex justify-end pr-10">
                <button
                  onClick={() => setShowConfirmDialog(true)}
                  className="text-orange-500 text-base font-bold hover:underline"
                >
                  {userData.status === "Normal"
                    ? "Ban This User"
                    : "Unban This User"}
                </button>
              </div>
            )}
          </div>
        );

      case "pets":
        return (
          <div className="bg-white h-[824px] rounded-b-lg rounded-tr-lg">
            <div className="p-10">
              {/* Displaying pet list */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {userData.pets.map((pet: Pet, index: number) => {
                  // Check if pet data is empty or null
                  const isPetEmpty = !pet.pet_name;

                  return (
                    <div
                      key={index}
                      onClick={() => {
                        if (!isPetEmpty) {
                          setSelectedPetId(pet.pet_id);
                          setShowConfirmDialog(true);
                        }
                      }}
                      className={`flex flex-col items-center justify-center w-full h-56 p-4 gap-3 bg-white rounded-lg border border-gray-300 hover:shadow-xl transition duration-300 cursor-pointer ${
                        isPetEmpty ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <div className="w-[104px] h-[104px] rounded-full overflow-hidden flex-shrink-0 relative">
                        <Image
                          src={
                            pet.pet_image || "https://via.placeholder.com/104"
                          }
                          alt="Pet"
                          layout="fill"
                          objectFit="cover"
                          objectPosition="center"
                        />
                      </div>
                      <p className="font-bold text-xl text-gray-600">
                        {pet.pet_name || "Don't have pet"}
                      </p>
                      {/* Displaying pet type (Dog, Cat, etc.) */}
                      {pet.pet_type === "Dog" ? (
                        <div className="flex flex-col justify-center w-16 h-8 bg-green-100 rounded-3xl border border-green-500">
                          <p className="text-base text-center text-green-500 font-medium">
                            {pet.pet_type}
                          </p>
                        </div>
                      ) : pet.pet_type === "Cat" ? (
                        <div className="flex flex-col justify-center w-16 h-8 bg-pink-100 rounded-3xl border border-pink-500">
                          <p className="text-base text-center text-pink-500 font-medium">
                            {pet.pet_type}
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col justify-center w-16 h-8 bg-blue-100 rounded-3xl border border-blue-500">
                          <p className="text-base text-center text-blue-500 font-medium">
                            {pet.pet_type}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case "reviews":
        return (
          <div className="p-6 bg-white rounded-b-lg rounded-tr-lg pt-10">
            {/* Displaying reviews */}
            {userData.reviews && userData.reviews.length > 0 ? (
              userData.reviews.map((review: Review, index: number) => (
                <div key={index} className="mb-6 border-b pb-4 flex gap-10">
                  <div className="flex items-center mb-2 ml-8 gap-3">
                    <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 relative">
                      <Image
                        src={
                          review.petsitter_image ||
                          "https://via.placeholder.com/104"
                        }
                        alt="Pet"
                        layout="fill"
                        objectFit="cover"
                        objectPosition="center"
                      />
                    </div>
                    <div>
                      <p className="w-36 text-lg font-medium">
                        {review.petsitter_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.review_date).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    {/* Displaying star ratings */}
                    <div className="rating">
                      {Array.from({ length: 5 }, (_, i) => (
                        <input
                          key={i}
                          type="radio"
                          name={`rating-${index}`} // Unique name for each review
                          className="mask mask-star-2 bg-green-500 w-5 h-5"
                          checked={i + 1 == review.rating} // Dynamically control which star is checked
                          readOnly // Make it read-only since it's just for display
                        />
                      ))}
                    </div>

                    <p className="text-base text-gray-500">
                      {review.review_message}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-base text-gray-500">
                No reviews found for this user.
              </p>
            )}
          </div>
        );
    }
  };

  // Function to handle tab changes (Profile, Pets, Reviews)
  const handleTabChange = (tab: "profile" | "pets" | "reviews") => {
    setActiveTab(tab);

    // Reset selectedPetId when switching to the "profile" tab to show user-related actions
    if (tab === "profile") {
      setSelectedPetId(null);
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
              className={`text-2xl font-bold ${loading ? "text-gray-500" : ""}`}
            >
              {loading ? "Loading..." : userData?.full_name || "Profile"}
            </h1>
          </div>
          <div className="w-full h-[700px]">
            <div className="flex space-x-4 bg-gray-100">
              <button
                onClick={() => handleTabChange("profile")}
                className={`py-2 px-6 w-32 h-14 font-semibold rounded-t-lg ${
                  activeTab === "profile"
                    ? "bg-white text-orange-500"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => handleTabChange("pets")}
                className={`py-2 px-6 w-32 font-semibold rounded-t-lg ${
                  activeTab === "pets"
                    ? "bg-white text-orange-500"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                Pets
              </button>
              <button
                onClick={() => handleTabChange("reviews")}
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

      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/25 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-[400px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {selectedPetId ? "Suspend Pet" : "Ban User"}
              </h2>
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 18L18 6M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <hr className="border-gray-200 mb-4" />
            <p className="text-gray-400 text-base mb-6">
              {selectedPetId
                ? "Are you sure you want to suspend this pet?"
                : "Are you sure to ban this user?"}
            </p>
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="w-[120px] py-2 rounded-3xl text-base font-bold bg-orange-100 text-orange-500 hover:bg-[#ffe4e4] transition-colors"
              >
                Cancel
              </button>
              {selectedPetId ? (
                <button
                  onClick={() => {
                    if (selectedPetId) deletePet(selectedPetId);
                  }}
                  className="w-[176px] text-base py-2 rounded-3xl font-bold bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                >
                  Suspend this pet
                </button>
              ) : (
                <button
                  onClick={handleBanUnban}
                  className="w-[120px] text-base py-2 rounded-3xl font-bold bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                >
                  Ban User
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAdminAuth(AdminPetownerProfile);
