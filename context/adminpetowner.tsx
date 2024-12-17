import React, { createContext, useContext, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface Pet {
  pet_id: string;
  pet_image: string;
  pet_name: string;
  pet_type: string;
}

interface Review {
  petsitter_id: string;
  petsitter_name: string;
  petsitter_image: string | null;
  rating: number;
  review_message: string;
  review_date: string;
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

interface UserDataContextType {
  userData: UserData | null;
  loading: boolean;
  error: string | null;
  fetchUserData: () => Promise<void>;
  handleBanUnban: () => Promise<void>;
  deletePet: (petId: string) => Promise<void>;
}

const UserDataContext = createContext<UserDataContextType | undefined>(
  undefined
);

export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
    }
  };

  const deletePet = async (petId: string) => {
    try {
      const response = await fetch(`/api/admin/petownerinfo?uid=${uid}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ petId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete pet");
      }

      await fetchUserData();
    } catch (error) {
      console.error("Error:", error);
      setError((error as Error).message);
    }
  };

  useEffect(() => {
    if (uid) {
      fetchUserData();
    }
  }, [uid]);

  return (
    <UserDataContext.Provider
      value={{
        userData,
        loading,
        error,
        fetchUserData,
        handleBanUnban,
        deletePet,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error("useUserData must be used within a UserDataProvider");
  }
  return context;
};
