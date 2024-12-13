import React from "react";
import Image from "next/image";
import BackArrow from "@/public/assets/back-arrow.svg";
import petProfileDefault from "@/public/assets/pet-img-defult.svg";
import plusIcon from "@/public/assets/plus-icon.svg";
interface YourPetEditProps {
  setchangePage: (page: string) => void;
}
function YourPetCreate({ setchangePage }: YourPetEditProps) {
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
          <h3 className="py-2 text-2xl font-bold ">Your Pet</h3>
        </div>
      </div>
      {/* upload image */}

      <div className="px-4 md:px-0">
        <div className="relative rounded-full w-32 h-32 md:w-60 md:h-60 bg-gray-200 flex items-center justify-center md:mt-6 ">
          <Image
            src={petProfileDefault}
            alt="pet image"
            width={240}
            height={240}
            className={`object-cover w-24 h-24 rounded-full `}
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

      {/* form submit add create */}
      <form className="px-4">
        {/*input Name */}
        <div className="label-text pb-2 font-bold">Pet Name*</div>
        <div className="input flex items-center  input-bordered focus-within:outline-none focus-within:border-orange-500 mb-6">
          <input type="text" placeholder="Your Name" className="w-full" />
        </div>
        {/*input Pet Type* ande Breed */}
        <div className=" flex flex-col md:flex-row md:gap-5">
          <div className="w-full md:w-1/2 ">
            <div className="label-text pb-2 font-bold">Pet Type*</div>
            <div className="input flex items-center  input-bordered focus-within:outline-none focus-within:border-orange-500 mb-6 p-0">
              <select className="w-full focus-within:outline-none px-3 ">
                <option disabled selected className="w-full !text-gray-500">
                  Select your pet type
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
                  Select sex of your pet
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
              />
            </div>
          </div>
        </div>
        {/* input About */}
        <div className="label-text pb-2 font-bold">About</div>
        <div className="input flex items-center  input-bordered focus-within:outline-none focus-within:border-orange-500 mb-6 h-auto">
          <textarea
            className=" w-full pt-2 focus-within:outline-none"
            placeholder="Describe more about your pet..."
            rows={5}
          ></textarea>
        </div>

        {/* button cancel and create */}
        <div className="flex justify-between">
          <button
            type="submit"
            className=" w-[159px] h-[48px] flex items-center justify-center rounded-3xl text-base font-bold text-orange-500 bg-[#FFF1EC] mb-6"
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

export default YourPetCreate;
