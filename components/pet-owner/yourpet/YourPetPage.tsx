import React from "react";
import Image from "next/image";
import petProfileDefault from "@/public/assets/pet-img-defult.svg";

interface PetData {
  pet_id: number;
  pet_name: string;
  pet_type: string;
  breed: string;
  sex: string;
  age: string;
  color: string;
  weight: string;
  about: string | null;
  image: string;
  status: string;
}

interface YourpetPageProps {
  dataPet: PetData[];
  setchangePage: (page: string) => void;
  setPetIdEdit: (id: number) => void;
}

function YourpetPage({
  dataPet,
  setchangePage,
  setPetIdEdit,
}: YourpetPageProps) {
  return (
    <div className="flex flex-col w-full bg-white rounded-2xl gap-4 md:ml-8 md:mr-20 md:mt-10 md:mb-20 md:px-10 md:py-7">
      <div className="mx-4 mt-6 mb-2 flex justify-between md:mx-0 md:mt-0  ">
        {/* text your pet and button create */}
        <h3 className="py-2 text-2xl font-bold truncate">Your Pet</h3>
        <button
          className="px-6 py-3 text-base font-bold bg-orange-500 text-white rounded-full truncate"
          onClick={() => setchangePage("Create")}
        >
          Create Pet
        </button>
      </div>
      {/*main card */}
      <div className="flex flex-col gap-4 items-center justify-center md:grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 ">
        {/* card show pet */}
        {dataPet.map((pet, index) => (
          <div className="px-4 flex w-full md:px-0 lg:w-auto" key={index}>
            <div className="card flex flex-col items-center justify-center pt-6 pb-4 text-center border-2 h-full w-full bg-white lg:w-72">
              <div className="w-28 h-28 bg-gray-200 rounded-full flex justify-center items-center ">
                <Image
                  src={pet.image || petProfileDefault}
                  alt={pet.pet_name}
                  width={104}
                  height={104}
                  className={` ${pet.image  ?"rounded-full w-full h-full object-cover bg-gray-200 cursor-pointer":"w-16 h-16"} `}
                  onClick={() => {
                    setchangePage("Edit");
                    setPetIdEdit(pet.pet_id);
                  }}
                />
              </div>
              <h2 className="py-4 text-xl font-bold">{pet.pet_name}</h2>
              <h2
                className={`text-base font-medium py-1 px-4 rounded-full border-2 
            ${
              pet.pet_type === "Dog"
                ? "bg-green-100  text-green-500  border-green-500 mb-7"
                : pet.pet_type === "Rabbit"
                ? "bg-orange-100 badge-outline text-orange-500 mb-7"
                : pet.pet_type === "Cat"
                ? "bg-pink-100 badge-outline text-pink-500 mb-7"
                : " bg-blue-100 badge-outline text-blue-500 mb-7"
            }
            `}
              >
                {pet.pet_type}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default YourpetPage;
