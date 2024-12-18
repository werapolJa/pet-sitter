import Header from "@/components/home-page/Header";
import bgImg from "@/public/assets/bgsuccess.svg";
import bgImg2 from "@/public/assets/bgsuccess2..svg";
import Image from "next/image";
import { useBookingContext } from "@/context/BookingContext";
import bgimg from "@/public/assets/bgsuccessmobile.svg";
import { useRouter } from "next/router";

export default function BookingPage() {
  const { bookingData } = useBookingContext();
  const { bookingDetail } = bookingData;
  const router = useRouter();
  return (
    <div className="w-screen md:h-screen h-auto bg-[#FAFAFB]">
      <Header />
      <main className="mt-0 md:mt-28 flex justify-center items-center">
        <div className="w-[632px] md:rounded-2xl shadow-sm md:shadow-xl overflow-hidden">
          <div className="w-full h-1/3 bg-black flex flex-col items-center justify-center gap-2 p-6">
            <h2 className="text-white font-bold text-xl md:text-4xl">
              Thank You For Booking
            </h2>
            <p className="text-gray-300 text-xs md:text-[16px] font-medium">
              We will send your booking information to Pet Sitter.
            </p>
          </div>
          <div className="w-full h-2/3 p-10 bg-white flex flex-col itnterems-ce justify-center gap-6">
            <div>
              <p className="text-[#AEB1C3] font-medium">
                Transaction Date: Tue, 16 Oct 2022
              </p>
              <p className="text-[#AEB1C3] font-medium">
                Transaction No. : 122312
              </p>
            </div>
            <div>
              <p className="text-gray-400 font-medium">Pet Sitter:</p>
              <p className="font-medium">
                {bookingDetail.petSitter ?? "-"} By{" "}
                {bookingDetail.petSitterName ?? "-"}
              </p>
            </div>
            <div className="flex">
              <div className="w-1/2">
                <p className="text-gray-400 font-medium">Date & Time:</p>
                <p className="font-medium">{bookingDetail.dateTime ?? "-"}</p>
              </div>
              <div>
                <p className="text-gray-400 font-medium">Duration:</p>
                <p className="font-medium">{bookingDetail.duration ?? "-"}</p>
              </div>
            </div>
            <div>
              <p className="text-[#AEB1C3] font-medium">Pet:</p>
              <p className="font-medium">
                {bookingData.selectedPets.length > 0
                  ? bookingData.selectedPets
                      .map((pet) => pet.pet_name)
                      .join(", ")
                  : "-"}
              </p>
            </div>
            <div className="divider my-0 "></div>
            <div className="flex justify-between">
              <p className="font-medium">Total</p>
              <p className="font-medium text-[18px]">
                {bookingDetail.total ?? "-"}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Image
        src={bgImg2}
        alt="ิbackground"
        className="absolute top-16 left-0 hidden md:block "
        loading="lazy"
      />
      <Image
        src={bgImg}
        alt="ิbackground"
        className="absolute right-0 bottom-0 hidden md:block "
        loading="lazy"
      />
      <Image
        src={bgimg}
        alt="ิbackground"
        className="block md:hidden "
        loading="lazy"
      />
      <div className="flex md:hidden justify-between mb-10 px-5">
        <button className="btn px-6 py-3 rounded-full font-bold bg-[#FFF1EC] hover:bg-[#FFF1EC] active:bg-[#FFF1EC] border-none text-orange-500">
          Booking Detail
        </button>
        <button
          className={`btn px-6 py-3 font-bold rounded-full 
           text-white bg-orange-500 hover:bg-orange-500
          }`}
          onClick={() => router.push("/")}
        >
          Back To Home
        </button>
      </div>
    </div>
  );
}
