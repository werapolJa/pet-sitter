import React, { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import BackArrow from "@/public/assets/back-arrow.svg";
import petProfileDefault from "@/public/assets/pet-img-defult.svg";
import plusIcon from "@/public/assets/plus-icon.svg";
import axios from "axios";
import Input from "../Input";
import PetAgeInput from "@/components/pet-owner/PetAgeInput";
import InputSelect from "@/components/pet-owner/InputSelect";
interface YourPetEditProps {
  setchangePage: (page: string) => void;
}

function YourPetCreate({ setchangePage }: YourPetEditProps) {
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState<string | null>(null);

  const [name, setName] = useState<string>("");
  const [breed, setBreed] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [selectType, setSelectType] = useState("");
  const [selectsex, setSelectSex] = useState("");

  const [nameError, setNameError] = useState<boolean>(false);
  const [breedError, setBreedError] = useState<boolean>(false);
  const [ageError, setAgeError] = useState<boolean>(false);
  const [colorError, setColorError] = useState<boolean>(false);
  const [WeightError, setWeightError] = useState<boolean>(false);
  const [selectTypeError, setSelectTypeError] = useState<boolean>(false);
  const [selectSexError, setSelectSexError] = useState<boolean>(false);

  const [messageErrorName, setMessageErrorName] = useState<string>("");
  const [messageErrorBreed, setMessageErrorBreed] = useState<string>("");
  const [messageErrorAge, setMessageErrorAge] = useState<string>("");
  const [messageErrorColor, setMessageErrorColor] = useState<string>("");
  const [messageErrorWeight, setMessageErrorWeight] = useState<string>("");
  const [messageErrorSelectType, setMessageErrorSelectType] =
    useState<string>("");
  const [messageErrorSelectSex, setMessageErrorSelectSex] =
    useState<string>("");

  const handleSelectSex = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectSex(e.target.value);
    setSelectSexError(false);
    setMessageErrorSelectSex("");
  };
  const handleSelectType = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectType(e.target.value);
    setSelectTypeError(false);
    setMessageErrorSelectType("");
  };
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setNameError(false);
    setMessageErrorName("");
  };
  const handleBreedChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBreed(e.target.value);
    setBreedError(false);
    setMessageErrorBreed("");
  };

  const handleAgeChange = (value: string) => {
    setAge(value);
    setAgeError(false);
    setMessageErrorAge("");
  };
  const handleNameColor = (e: ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
    setColorError(false);
    setMessageErrorColor("");
  };

  const handleWeightChange = (value: string) => {
    setWeight(value);
    setWeightError(false);
    setMessageErrorWeight("");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      alert("No file selected.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }

    setLoading(true);

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("image", file);
    // console.log(formData);

    try {
      const response = await axios.post(
        "/api/petowners/pet/uploadyoupet",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setImage(response.data.urls[0]);
    } catch (err) {
      console.log("Error uploading image:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let hasError = false;
    if (!name) {
      setNameError(true);
      setMessageErrorName("Name is required.");
      hasError = true;
    } else if (name.length < 6 || name.length > 20) {
      setNameError(true);
      setMessageErrorName("Name must be between 6 and 20 characters.");
      hasError = true;
    } else {
      setNameError(false); // Reset error if name is valid
    }

    if (!breed) {
      setBreedError(true);
      setMessageErrorBreed("Breed is required.");
      hasError = true;
    } else if (breed.length < 6 || breed.length > 20) {
      setBreedError(true);
      setMessageErrorBreed("Breed must be between 6 and 20 characters.");
      hasError = true;
    } else {
      setBreedError(false); // Reset error if name is valid
    }

    if (!age) {
      setAgeError(true);
      setMessageErrorAge("age is required.");
      hasError = true;
    } else if (age === "0.0") {
      setAgeError(true);
      setMessageErrorAge("Age not 0.0");
      hasError = true;
    } else {
      setAgeError(false); // Reset error if name is valid
    }

    if (!color) {
      setColorError(true);
      setMessageErrorColor("color is required.");
      hasError = true;
    } else if (color.length < 6 || color.length > 20) {
      setColorError(true);
      setMessageErrorColor("Color must be between 6 and 20 characters.");
      hasError = true;
    } else {
      setColorError(false); // Reset error if name is valid
    }

    if (!weight) {
      setWeightError(true);
      setMessageErrorWeight("Weight is required.");
      hasError = true;
    } else if (weight.length < 6 || weight.length > 20) {
      setWeightError(true);
      setMessageErrorWeight("Weight must be between 6 and 20 characters.");
      hasError = true;
    } else {
      setColorError(false); // Reset error if name is valid
    }
    if (!selectType) {
      setSelectTypeError(true);
      setMessageErrorSelectType("You must select an option!");
    } else {
      setSelectTypeError(false);
      setMessageErrorSelectType("");
    }
    if (!selectsex) {
      setSelectSexError(true);
      setMessageErrorSelectSex("You must select an option!");
    } else {
      setSelectSexError(false);
      setMessageErrorSelectSex("");
    }
  };
  const ProfileImage = ({
    image,
    onImageChange,
  }: {
    image: string | null;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <div className="relative rounded-full w-32 h-32 md:w-60 md:h-60 bg-gray-200 flex items-center justify-center mt-6 ">
      <Image
        src={image || petProfileDefault}
        alt="Profile"
        width={240}
        height={240}
        className={`object-cover w-full h-full rounded-full ${
          !image ? "p-12 md:p-0 w-10 h-10 md:w-20 md:h-20 opacity-80" : ""
        }`}
      />
      <button
        className="absolute bottom-1 right-1 md:bottom-1 md:right-1 bg-orange-100 text-white rounded-full p-2 md:p-4 md:w-15 md:h-15"
        onClick={() => document.getElementById("file-upload")?.click()}
      >
        <Image
          className="md:w-4 md:h-4"
          src={plusIcon}
          alt="Add"
          width={16}
          height={16}
        />
      </button>
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept="image/*"
        onChange={onImageChange}
      />
    </div>
  );

  return (
    <div
      className="flex flex-col w-full rounded-2xl bg-white gap-4 md:min-w-[700px] p-4 md:ml-8 md:mr-20 md:mt-10 md:mb-20 md:px-10 md:py-7 "
      onSubmit={handleSubmit}
    >
      <div className="mx-4 mt-6 mb-2 flex justify-between md:mx-0 md:mt-0 ">
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
        <ProfileImage image={image} onImageChange={handleImageUpload} />
      </div>

      <form>
        {/*input Name */}
        <div className=" md:pb-8">
          <Input
            label="Your Pet*"
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Pet Name"
            error={nameError}
            errorMsg={messageErrorName}
          />
        </div>
        {/*input Pet Type* ande Breed */}
        <div className=" flex flex-col  md:flex-row md:gap-5  md:pb-6 ">
          {/* select input */}
          <div className="w-full md:w-1/2 ">
            <InputSelect
              label="Pet Type*"
              value={selectType}
              onChange={handleSelectType}
              placeholder="Select your pet type"
              options={[
                { value: "dog", label: "Dog" },
                { value: "cat", label: "Cat" },
                { value: "bird", label: "Bird" },
                { value: "rabbit", label: "Rabbit" },
              ]}
              error={selectTypeError}
              errorMsg={messageErrorSelectType}
            />
          </div>

          <div className="w-full md:w-1/2 bg pb-">
            <Input
              label="Breed*"
              type="text"
              value={breed}
              onChange={handleBreedChange}
              placeholder="Breed of your pet"
              error={breedError}
              errorMsg={messageErrorBreed}
            />
          </div>
        </div>
        {/* input Sex and Age */}
        <div className="flex flex-col md:flex-row md:gap-5  md:pb-6">
          <div className="w-full md:w-1/2 ">
            <InputSelect
              label="Sex*"
              value={selectsex}
              onChange={handleSelectSex}
              placeholder="Select sex of your pet"
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
              ]}
              error={selectSexError}
              errorMsg={messageErrorSelectSex}
            />
          </div>
          <div className="w-full md:w-1/2 md:mb-0">
            <div className="">
              <PetAgeInput
                label="Age (Month)*"
                type="tel"
                value={age}
                onChange={handleAgeChange}
                placeholder="Age of your pet"
                error={ageError}
                errorMsg={messageErrorAge}
              />
            </div>
          </div>
        </div>
        {/* input color and weight */}
        <div className="flex flex-col md:flex-row md:gap-5 md:pb-10">
          <div className="w-full md:w-1/2 ">
            <Input
              label="Color*"
              type="text"
              value={color}
              onChange={handleNameColor}
              placeholder="Describe color of your pet"
              error={colorError}
              errorMsg={messageErrorColor}
            />
          </div>

          <div className="w-full md:w-1/2  md:mb-0">
            <PetAgeInput
              label="Weight (Kilogram)*"
              type="tel"
              value={weight}
              onChange={handleWeightChange}
              placeholder="eight of your per"
              error={WeightError}
              errorMsg={messageErrorWeight}
            />
          </div>
        </div>
        {/* input About */}

        <div className="label-text text-base font-medium py-2">About</div>
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
            type="button"
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
