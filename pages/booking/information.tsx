import Header from "@/components/home-page/Header";
import bgImg from "@/public/assets/bookingbg.svg";
import Image from "next/image";
import Input from "@/components/pet-owner/Input";
import { useState, ChangeEvent } from "react";

export default function BookingPage() {
  const [fullname, setFullname] = useState<string>("");
  const [Email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [additionalMsg, setAdditionalMsg] = useState<string | null>(null);

  const [fullnameError, setFullnameError] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [phoneError, setPhoneError] = useState<boolean>(false);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };
  const handleFullnameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFullname(e.target.value);
  };
  const handleAdditionalMsgChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setAdditionalMsg(e.target.value);
  };

  return (
    <div className="w-screen h-screen bg-[#FAFAFB]">
      <Header />
      <main className="px-5 pt-10 flex gap-9 md:px-12 h-5/6">
        <div className="w-2/3 flex flex-col gap-4">
          <div className="bg-white w-full h-1/6 rounded-2xl flex justify-center items-center gap-12">
            <div className="flex justify-center items-center gap-3">
              <h3 className="font-bold text-2xl text-orange-500 w-12 h-12 bg-black flex justify-center items-center rounded-full">
                1
              </h3>
              <p className="text-xl font-medium">Your Pet</p>
            </div>
            <div className="flex justify-center items-center gap-3">
              <h3 className="font-bold text-2xl text-white w-12 h-12 bg-orange-500 flex justify-center items-center rounded-full">
                2
              </h3>
              <p className="text-orange-500 text-xl font-medium">Information</p>
            </div>
            <div className="flex justify-center items-center gap-3">
              <h3 className="font-bold text-2xl text-gray-400 w-12 h-12 bg-gray-100 flex justify-center items-center rounded-full">
                3
              </h3>
              <p className="text-gray-400 text-xl font-medium">Payment</p>
            </div>
          </div>
          <div className="bg-white w-full h-[720px] rounded-2xl p-10 flex flex-col gap-14 justify-between">
            <div className="flex flex-col gap-10 w-full">
              <Input label="Your Name*" placeholder="Full name" onChange={handleFullnameChange}/>
              <div className="flex justify-between w-full gap-10">
                <div className="w-1/2">
                  <Input label="Email*" placeholder="youremail@company.com" onChange={handleEmailChange}/>
                </div>
                <div className="w-1/2">
                  <Input label="Phone*" placeholder="xxx-xxx-xxxx" onChange={handlePhoneChange}/>
                </div>
              </div>
              <div>
                <div className="divider"></div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base font-medium">
                      Additional Message (To pet sitter)
                    </span>
                  </label>
                  <textarea
                    id="my-textarea"
                    onChange={handleAdditionalMsgChange}
                    className="h-[140px] textarea textarea-bordered textarea-lg w-full resize-none focus-within:outline-none focus-within:border-orange-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <button className="btn px-10 py-3 rounded-full font-bold bg-[#FFF1EC] hover:bg-[#FFF1EC] active:bg-[#FFF1EC] border-none text-orange-500">
                Back
              </button>
              <button
              // className={`btn px-10 py-3 font-bold rounded-full ${
              //   btndisable
              //     ? "text-[#AEB1C3] bg-gray-200"
              //     : "text-white bg-orange-500 hover:bg-orange-500"
              // }`}
              >
                Next
              </button>
            </div>
          </div>

          {/* Booking Detail */}
        </div>
        <div className="card bg-white w-1/3 h-4/6 rounded-2xl shadow-xl overflow-hidden">
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
                <span className="mr-3">Happy House!</span>
                <span>By Jane Maison</span>
              </p>
            </div>
            <div className="px-6">
              <span className="text-gray-400 font-medium text-sm">
                Date & Time:
              </span>
              <p className="text-gray-600 font-medium">
                <span className="mr-3">25 Aug, 2023</span>
                <span className="mr-3 text-gray-400">|</span>
                <span>7 AM - 10 AM</span>
              </p>
            </div>
            <div className="px-6">
              <span className="text-gray-400 font-medium text-sm">
                Duration:
              </span>
              <p className="text-gray-600 font-medium">3 hours</p>
            </div>
            <div className="px-6">
              <span className="text-gray-400 font-medium text-sm">Pet:</span>
              <p className="text-gray-600 font-medium">
                -
                {/* {selectedPets.length > 0
                  ? selectedPets.map((pet) => pet.pet_name).join(", ")
                  : "-"} */}
              </p>
            </div>
          </div>
          <div className="h-1/6 bg-black flex justify-between items-center text-white px-6">
            <p className="font-medium">Total</p>
            <p className="text-[18px] font-medium">600.00 THB</p>
          </div>
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
