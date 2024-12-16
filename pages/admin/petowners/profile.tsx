import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import withAdminAuth from "@/utils/withAdminAuth";
import { Sidebar } from "@/components/admin-page/Sidebar";
import Link from "next/link";

interface Review {
  petsitter_id: string;
  petsitter_name: string;
  petsitter_image: string | null;
  rating: number;
  review_message: string;
  review_date: string;
}

interface Pet {
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
  pets: Pet[];
  reviews: Review[];
}

const AdminPetownerProfile = () => {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"profile" | "pets" | "reviews">(
    "profile"
  );
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString("en-GB", options);
  };

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

  useEffect(() => {
    if (uid) {
      fetchUserData();
    }
  }, [uid]);

  const handleBanUnban = async () => {
    if (!userData) return;

    const newStatus = userData.status === "Normal" ? "Banned" : "Normal";

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

      await fetchUserData();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setShowConfirmDialog(false);
    }
  };

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
                src={userData.image || "https://via.placeholder.com/240"}
                alt="Profile"
                layout="fill"
                objectFit="cover"
                objectPosition="center"
              />
            </div>
            <div className="ml-8 space-y-6 h-[488px] bg-gray-50 w-full rounded-lg p-8">
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
                <p className="text-gray-400 font-bold text-xl">Date of Birth</p>
                <p className="text-base font-normal">
                  {formatDate(userData.birthdate)}
                </p>
              </div>
            </div>
          </div>
        );

      case "pets":
        return (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-4">Pets</h2>
            {userData.pets && userData.pets.length > 0 ? (
              userData.pets.map((pet: Pet, index: number) => (
                <div key={index} className="mb-4">
                  <Image
                    src={pet.pet_image || "https://via.placeholder.com/50"}
                    alt={pet.pet_image}
                    width={50}
                    height={50}
                    className="rounded-full mr-4"
                  ></Image>
                  <p className="font-semibold">{pet.pet_name}</p>
                  <p className="text-gray-600">{pet.pet_type}</p>
                </div>
              ))
            ) : (
              <p>No pets found for this user.</p>
            )}
          </div>
        );

      case "reviews":
        return (
          <div className="p-6">
            <h2 className="text-lg font-bold mb-4">Reviews</h2>
            {userData.reviews && userData.reviews.length > 0 ? (
              userData.reviews.map((review: Review, index: number) => (
                <div key={index} className="mb-6 border-b pb-4">
                  <div className="flex items-center mb-2">
                    <Image
                      src={
                        review.petsitter_image ||
                        "https://via.placeholder.com/50"
                      }
                      alt={review.petsitter_name}
                      width={50}
                      height={50}
                      className="rounded-full mr-4"
                    />
                    <div>
                      <p className="font-semibold">{review.petsitter_name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.review_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="mb-2">Rating: {review.rating} / 5</p>
                  <p>{review.review_message}</p>
                </div>
              ))
            ) : (
              <p>No reviews found for this user.</p>
            )}
          </div>
        );
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
            <h1 className="text-2xl font-bold">
              {loading ? "Loading..." : userData?.full_name || "Profile"}
            </h1>
          </div>
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
        </div>
      </div>
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <p className="mb-4">
              Are you sure you want to{" "}
              {userData?.status === "Normal" ? "ban" : "unban"} this user?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleBanUnban}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAdminAuth(AdminPetownerProfile);
