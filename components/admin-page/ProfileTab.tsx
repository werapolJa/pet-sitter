import React from "react";
import Image from "next/image";
import { useUserData } from "@/context/adminpetowner";
import { ConfirmDialog } from "./ConfirmDialog";
import { useState } from "react";

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  return date.toLocaleDateString("en-GB", options);
};

export const ProfileTab: React.FC = () => {
  const { userData, handleBanUnban } = useUserData();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  if (!userData) return null;

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
          <div>
            <p className="text-gray-400 font-bold text-xl">Pet Owner Name</p>
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
      <div className="flex justify-end pr-10">
        <button
          onClick={() => setShowConfirmDialog(true)}
          className="text-orange-500 text-base font-bold hover:underline"
        >
          {userData.status === "Normal" ? "Ban This User" : "Unban This User"}
        </button>
      </div>
      {showConfirmDialog && (
        <ConfirmDialog
          title={userData.status === "Normal" ? "Ban User" : "Unban User"}
          message={`Are you sure you want to ${
            userData.status === "Normal" ? "ban" : "unban"
          } this user?`}
          onConfirm={() => {
            handleBanUnban();
            setShowConfirmDialog(false);
          }}
          onCancel={() => setShowConfirmDialog(false)}
        />
      )}
    </div>
  );
};
