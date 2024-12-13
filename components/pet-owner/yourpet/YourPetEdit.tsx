import React, { useEffect, useState } from "react";
import Image from "next/image";
import BackArrow from "@/public/assets/back-arrow.svg";
import Deleteicon from "@/public/assets/delete-bin.svg";
import axios from "axios";
import { useAuth } from "@/context/authentication";
import petProfileDefault from "@/public/assets/pet-img-defult.svg";
import plusIcon from "@/public/assets/plus-icon.svg";
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
interface YourPetEditProps {
  petIdEdit: number;
  setchangePage: (page: string) => void;
}
function YourPetEdit({ petIdEdit, setchangePage }: YourPetEditProps) {
  const { user } = useAuth();
  const [petdata, setPetData] = useState<PetData | null>(null);

  console.log(petdata);

  useEffect(() => {
    if (user?.sub) {
      getPetId();
    }
  }, [user?.sub, petIdEdit]);
  const getPetId = async () => {
    try {
      const res = await axios.get(
        `/api/petowners/pet/${user?.sub}?pet_id=${petIdEdit}`
      );

      setPetData(res.data.data[0]);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col w-full bg-white rounded-2xl gap-4 md:ml-8 md:mr-20 md:mt-10 md:mb-20 md:px-10 md:py-7">
      <div className="mx-4 mt-6 mb-2 flex justify-between md:mx-0 md:mt-0  ">
        {/* text your pet and button create */}
        <div className="flex text-center justify-center items-center">
          <Image
            src={BackArrow}
            alt=""
            height={28}
            width={20}
            className="mr-2 cursor-pointer"
            onClick={() => setchangePage("Home")}
          />
          <h3 className="py-2 text-2xl font-bold ">Your Pet Edit</h3>
        </div>
      </div>
      {/* upload image */}

      <div className="px-4 md:px-0">
        <div className="relative rounded-full w-32 h-32 md:w-60 md:h-60 bg-gray-200 flex items-center justify-center md:mt-6 ">
          <Image
            src={petdata?.image || petProfileDefault}
            alt="pet image"
            width={240}
            height={240}
            className={` ${
              petdata?.image
                ? "w-full h-full object-cover rounded-full"
                : "w-24 h-24"
            } `}
          />
          <button
            className="absolute bottom-1 right-1 md:bottom-1 md:right-4 bg-orange-100 text-white rounded-full p-2 md:p-4 md:w-15 md:h-15"
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <Image
              className="w-3 h-3 md:w-4 md:h-4"
              src={plusIcon}
              alt="Add pet image"
              width={16}
              height={16}
            />
          </button>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept="image/*"
          />
        </div>
      </div>

      {/* form  */}
      <form className="px-4">
        {/*input Name */}
        <div className="label-text pb-2 font-bold">Pet Name*</div>
        <div className="input flex items-center  input-bordered focus-within:outline-none focus-within:border-orange-500 mb-6">
          <input type="text" placeholder="Your Name" className="w-full" value={petdata?.pet_name} />
        </div>
        {/*input Pet Type* ande Breed */}
        <div className=" flex flex-col md:flex-row md:gap-5">
          <div className="w-full md:w-1/2 ">
            <div className="label-text pb-2 font-bold">Pet Type*</div>
            <div className="input flex items-center  input-bordered focus-within:outline-none focus-within:border-orange-500 mb-6 p-0">
              <select className="w-full focus-within:outline-none px-3 ">
                <option disabled selected className="w-full !text-gray-500">
                  {petdata?.pet_type}
                </option>
                <option>Dog</option>
                <option>Cat</option>
                <option>Bird</option>
                <option>Rabbit</option>
              </select>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="label-text pb-2 font-bold">Breed*</div>
            <div className="input flex items-center  input-bordered focus-within:outline-none focus-within:border-orange-500 mb-6">
              <input
                type="text"
                placeholder="Breed of your pet"
                className="w-full"
                value={petdata?.breed}
              />
            </div>
          </div>
        </div>
        {/* input Sex and Age */}
        <div className="flex flex-col md:flex-row md:gap-5">
          <div className="w-full md:w-1/2 ">
            <div className="label-text pb-2 font-bold">Sex*</div>
            <div className="input flex items-center  input-bordered focus-within:outline-none focus-within:border-orange-500 mb-6 p-0">
              <select className="w-full focus-within:outline-none px-3">
                <option disabled selected className="w-full ">
                  {petdata?.sex}
                </option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
          </div>

          <div className="w-full md:w-1/2  md:mb-0">
            <div className="label-text pb-2 font-bold">Age (Month)*</div>
            <div className="input flex items-center  input-bordered focus-within:outline-none focus-within:border-orange-500 mb-6">
              <input
                type="text"
                placeholder="Age of your pet"
                className="w-full"
                value={petdata?.age}
              />
            </div>
          </div>
        </div>
        {/* input color and weight */}
        <div className="flex flex-col md:flex-row md:gap-5">
          <div className="w-full md:w-1/2 ">
            <div className="label-text pb-2 font-bold">Color*</div>
            <div className="input flex items-center  input-bordered focus-within:outline-none focus-within:border-orange-500 mb-6">
              <input
                type="text"
                placeholder="Describe color of your pet"
                className="w-full"
                value={petdata?.color}
              />
            </div>
          </div>
          <div className="w-full md:w-1/2  md:mb-0">
            <div className="label-text pb-2 font-bold">Weight (Kilogram)*</div>
            <div className="input flex items-center  input-bordered focus-within:outline-none focus-within:border-orange-500 mb-6">
              <input
                type="text"
                placeholder="Weight of your per"
                className="w-full"
                value={petdata?.weight}
              />
            </div>
          </div>
        </div>
        {/* input About */}
        <div className="label-text pb-2 font-bold">About</div>
        <div className="input flex items-center  input-bordered focus-within:outline-none focus-within:border-orange-500 mb-6 h-auto">
          <textarea
            value={petdata?.about ?? ""}
            className=" w-full pt-2 focus-within:outline-none"
            placeholder="Describe more about your pet..."
            rows={5}
          ></textarea>
        </div>
        <div className="flex justify-center md:inline">
          <button
            type="button"
            className=" w-[159px] h-[48px] flex  items-center justify-center gap-3 rounded-3xl text-base font-bold text-orange-500 bg-[#FFF1EC] mb-6 md:bg-transparent"
          >
            <Image src={Deleteicon} alt="delete pet" className="mb-1" />
            Delete Pet
          </button>
        </div>
        {/* button cancel and create */}
        <div className="flex justify-between">
          <button
            type="button"
            className=" w-[159px] h-[48px] flex items-center justify-center rounded-3xl text-base font-bold text-orange-500 bg-[#FFF1EC] mb-6 "
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-[159px] h-[48px] flex items-center justify-center rounded-3xl text-base font-bold text-white bg-orange-500"
          >
            Create Pet
          </button>
        </div>
      </form>
    </div>
  );
}

export default YourPetEdit;
