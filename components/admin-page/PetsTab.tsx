import React, { useState } from 'react';
import Image from 'next/image';
import { useUserData } from '@/context/adminpetowner';
import { ConfirmDialog } from './ConfirmDialog';

export const PetsTab: React.FC = () => {
  const { userData, deletePet } = useUserData();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  if (!userData) return null;

  return (
    <div className="bg-white h-[824px] rounded-b-lg rounded-tr-lg">
      <div className="p-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {userData.pets.map((pet, index) => {
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
                    src={pet.pet_image || "https://via.placeholder.com/104"}
                    alt="Pet"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                  />
                </div>
                <p className="font-bold text-xl text-gray-600">
                  {pet.pet_name || "Don't have pet"}
                </p>
                <div className={`flex flex-col justify-center w-16 h-8 rounded-3xl border ${
                  pet.pet_type === "Dog" ? "bg-green-100 border-green-500 text-green-500" :
                  pet.pet_type === "Cat" ? "bg-pink-100 border-pink-500 text-pink-500" :
                  "bg-blue-100 border-blue-500 text-blue-500"
                }`}>
                  <p className="text-base text-center font-medium">
                    {pet.pet_type}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {showConfirmDialog && (
        <ConfirmDialog
          title="Suspend Pet"
          message="Are you sure you want to suspend this pet?"
          onConfirm={() => {
            if (selectedPetId) {
              deletePet(selectedPetId);
              setShowConfirmDialog(false);
            }
          }}
          onCancel={() => setShowConfirmDialog(false)}
        />
      )}
    </div>
  );
};