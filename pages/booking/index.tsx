import Header from "@/components/home-page/Header";
import bgImg from "@/public/assets/bookingbg.svg";
import Image from "next/image";
import addPetImg from "@/public/assets/addpetbooking.svg";
import { useRouter } from "next/router";
import axios from "axios";
import { useAuth } from "@/context/authentication";
import { useEffect, useState } from "react";
import { useBookingContext } from '@/context/BookingContext';

interface Pet {
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

export default function BookingPage() {
  const { user } = useAuth();
  const { bookingData, updateBookingData } = useBookingContext();
  const { selectedPets } = bookingData;
  const [btndisable, setBtnDisable] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (user) {
      async function FetchPets() {
        try {
          const results = await axios.get(`/api/petowners/pet/${user?.sub}`);
          setPets(results.data.data);
        } catch {}
      }
      FetchPets();
    }
  }, [user]);

  const handlePetSelect = (pet: Pet, isSelected: boolean) => {
    if (isSelected) {
      updateBookingData({ selectedPets: [...selectedPets, pet] });
    } else {
      updateBookingData({
        selectedPets: selectedPets.filter((p) => p.pet_name !== pet.pet_name)
      });
    }
  };

  useEffect(() => {
    setBtnDisable(bookingData.selectedPets.length === 0);
  }, [bookingData.selectedPets]);

  const [pets, setPets] = useState<Pet[]>([]);


  return (
    <div className="w-screen md:h-screen h-auto bg-[#FAFAFB]">
      <Header />
      <main className="md:pt-10 flex gap-9 md:px-12 h-5/6 flex-col md:flex-row">
        <div className="w-full md:w-2/3 flex flex-col gap-4">
          <div className="bg-white w-full h-1/6 rounded-2xl flex justify-between md:justify-center items-center px-5 md:px-0 py-4 md:py-0 gap-0 md:gap-12">
            <div className="flex justify-center items-center gap-3">
              <h3 className="font-bold text-2xl text-white w-7 h-7 md:w-12 md:h-12 bg-orange-500 flex justify-center items-center rounded-full">
                1
              </h3>
              <p className="text-orange-500 text-sm md:text-xl font-medium">
                Your Pet
              </p>
            </div>
            <div className="flex justify-center items-center gap-3">
              <h3 className="font-bold text-2xl text-gray-400 w-7 h-7 md:w-12 md:h-12 bg-gray-100 flex justify-center items-center rounded-full">
                2
              </h3>
              <p className="text-gray-400 text-sm md:text-xl font-medium">
                Information
              </p>
            </div>
            <div className="flex justify-center items-center gap-3">
              <h3 className="font-bold text-2xl text-gray-400 w-7 h-7 md:w-12 md:h-12 bg-gray-100 flex justify-center items-center rounded-full">
                3
              </h3>
              <p className="text-gray-400 text-sm md:text-xl font-medium">
                Payment
              </p>
            </div>
          </div>
          <div className="bg-white w-full h-auto md:h-5/6 rounded-2xl px-5 pt-10 md:p-10 flex flex-col gap-14 justify-between">
            <div className="flex flex-col gap-4">
              <p className="text-[18px] font-medium">Choose your pet</p>
              {/* card */}
              <div className="flex gap-4 flex-wrap">
                {pets.map((pet, index) => (
                  <Card
                    key={index}
                    pet={pet}
                    isSelected={bookingData.selectedPets.some((p) => p.image === pet.image)}
                    onSelect={handlePetSelect}
                  />
                ))}
                <CardAdd />
              </div>
            </div>
            <div className="hidden md:flex md:justify-between ">
              <button className="btn px-10 py-3 rounded-full font-bold bg-[#FFF1EC] hover:bg-[#FFF1EC] active:bg-[#FFF1EC] border-none text-orange-500">
                Back
              </button>
              <button
                className={`btn px-10 py-3 font-bold rounded-full ${
                  btndisable
                    ? "text-[#AEB1C3] bg-gray-200"
                    : "text-white bg-orange-500 hover:bg-orange-500"
                }`}
                disabled={btndisable}
                onClick={() => router.push("/booking/information")}
              >
                Next
              </button>
            </div>
          </div>
        </div>
        {/* Booking Detail */}
        <div className="card bg-white w-full md:w-1/3 h-4/6 rounded-none md:rounded-2xl shadow-xl overflow-hidden">
          <div className="h-5/6 flex flex-col gap-6">
            <h3 className="text-gray-600 font-bold text-2xl px-6 pt-6">
              Booking Detail
            </h3>
            <div className="divider my-0"></div>
            <div className="px-6">
              <span className="text-gray-400 font-medium text-sm">
                Pet Sitter:
              </span>
              <p className="text-gray-600 font-medium">
                <span className="mr-3">{bookingData.bookingDetail.petSitter ?? '-'}</span>
                <span>{bookingData.bookingDetail.petSitterName ?? '-'}</span>
              </p>
            </div>
            <div className="px-6">
              <span className="text-gray-400 font-medium text-sm">
                Date & Time:
              </span>
              <p className="text-gray-600 font-medium">
                {bookingData.bookingDetail.dateTime ?? '-'}
              </p>
            </div>
            <div className="px-6">
              <span className="text-gray-400 font-medium text-sm">
                Duration:
              </span>
              <p className="text-gray-600 font-medium">{bookingData.bookingDetail.duration ?? '-'}</p>
            </div>
            <div className="px-6">
              <span className="text-gray-400 font-medium text-sm">Pet:</span>
              <p className="text-gray-600 font-medium mb-3 md:mb-0">
                {bookingData.selectedPets.length > 0
                  ? bookingData.selectedPets.map((pet) => pet.pet_name).join(", ")
                  : "-"}
              </p>
            </div>
          </div>
          <div className="h-1/6 bg-black flex justify-between items-center text-white px-6">
            <p className="font-medium py-4">Total</p>
            <p className="text-[18px] font-medium">{bookingData.bookingDetail.total ?? '-'}</p>
          </div>
        </div>
        <div className="flex md:hidden justify-between mb-10 px-5">
          <button className="btn px-10 py-3 rounded-full font-bold bg-[#FFF1EC] hover:bg-[#FFF1EC] active:bg-[#FFF1EC] border-none text-orange-500">
            Back
          </button>
          <button
            className={`btn px-10 py-3 font-bold rounded-full ${
              btndisable
                ? "text-[#AEB1C3] bg-gray-200"
                : "text-white bg-orange-500 hover:bg-orange-500"
            }`}
            disabled={btndisable}
            onClick={() => router.push("/booking/information")}
          >
            Next
          </button>
        </div>
      </main>
      <Image
        src={bgImg}
        alt="ิbackground"
        className="absolute right-0 bottom-0 hidden md:block "
        loading="lazy"
      />
    </div>
  );
}

interface CardProps {
  pet: Pet;
  isSelected: boolean;
  onSelect: (pet: Pet, isSelected: boolean) => void;
}

export function Card({ pet, isSelected, onSelect }: CardProps) {
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSelect(pet, event.target.checked);
  };

  let style = "";
  if (pet.pet_type === "Dog") {
    style =
      " badge bg-green-100 badge-outline text-green-500 py-4 px-4 font-medium text-base";
  } else if (pet.pet_type === "Cat") {
    style =
      " badge bg-pink-100 badge-outline text-pink-500 py-4 px-4 font-medium text-base";
  } else if (pet.pet_type === "Bird") {
    style =
      " badge bg-blue-100 badge-outline text-blue-500 py-4 px-4 font-medium text-base";
  } else if (pet.pet_type === "Rabbit") {
    style =
      " badge bg-orange-100 badge-outline text-orange-500 py-4 px-4 font-medium text-base";
  }

  return (
    <div
      className={`card w-full md:w-60 h-60 border hover:border-orange-500 relative ${
        isSelected ? "border-orange-500" : "border-gray-200"
      }`}
    >
      <label className="w-full h-full cursor-pointer justify-center items-center flex flex-col">
        <div className="avatar">
          <div className="rounded-full">
            <Image src={pet.image} alt={pet.pet_name} width={96} height={96} />
          </div>
        </div>
        <h2 className="card-title mt-4 text-center">{pet.pet_name}</h2>
        <div className={`mt-2 ${style}`}>{pet.pet_type}</div>
        <input
          type="checkbox"
          className="checkbox border-gray-200 [--chkbg:theme(colors.orange.500)] checked:border-orange-500 hover:border-orange-500 absolute top-3 right-3"
          onChange={handleCheckboxChange}
          checked={isSelected}
        />
      </label>
    </div>
  );
}

export function CardAdd() {
  const router = useRouter();
  return (
    <div
      className="card w-full md:w-60 h-60 bg-[#FFF1EC] justify-center items-center gap-3 cursor-pointer"
      onClick={() => router.push("/booking")}
    >
      <Image src={addPetImg} alt="Add Icon" loading="lazy" />
      <p className="font-bold text-orange-500">Create New Pet</p>
    </div>
  );
}

