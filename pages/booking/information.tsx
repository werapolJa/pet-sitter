import Header from "@/components/home-page/Header";
import bgImg from "@/public/assets/bookingbg.svg";
import Image from "next/image";
import Input from "@/components/pet-owner/Input";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/router";

export default function BookinginformPage() {
  const [fullname, setFullname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [additionalMsg, setAdditionalMsg] = useState<string | null>(null);

  const [fullnameError, setFullnameError] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [phoneError, setPhoneError] = useState<boolean>(false);
  const [btndisable, setBtndisable] = useState<boolean>(false);

  const [messageErrorEmail, setMessageErrorEmail] = useState<string>("");
  const [messageErrorPhone, setMessageErrorPhone] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    setBtndisable(
      !(
        fullname &&
        email &&
        phone &&
        !fullnameError &&
        !emailError &&
        !phoneError
      )
    );
  }, [fullname, email, phone, fullnameError, emailError, phoneError]);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError(false);
  };
  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
    setPhoneError(false);
  };
  const handleFullnameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFullname(e.target.value);
    setFullnameError(false);
  };
  const handleAdditionalMsgChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setAdditionalMsg(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    let hasError = false;

    if (!fullname) {
      setFullnameError(true);
      hasError = true;
    }

    if (!email) {
      setEmailError(true);
      setMessageErrorEmail("Email is required.");
      hasError = true;
    } else if (!isValidEmail(email)) {
      setEmailError(true);
      setMessageErrorEmail("Please enter a valid email address.");
      hasError = true;
    }

    if (!phone) {
      setPhoneError(true);
      setMessageErrorPhone("Phone number is required.");
      hasError = true;
    } else if (!isValidPhone(phone)) {
      setPhoneError(true);
      setMessageErrorPhone("Phone number must be exactly 10 digits.");
      hasError = true;
    }

    if (!hasError) {
      const data = {
        fullname,
        email,
        phone,
        additionalMsg,
      };

      console.log(data);
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  return (
    <div className="w-screen md:h-screen h-auto bg-[#FAFAFB]">
      <Header />
      <main className="md:pt-10 flex gap-9 md:px-12 h-5/6 flex-col md:flex-row">
        <div className="w-full md:w-2/3 flex flex-col gap-4">
          <div className="bg-white w-full h-1/6 rounded-2xl flex justify-between md:justify-center px-5 md:px-0 items-center py-4 md:py-0 gap-0 md:gap-12">
            <div className="flex justify-center items-center gap-3">
              <h3 className="font-bold text-2xl text-orange-500 w-7 h-7 md:w-12 md:h-12 bg-black flex justify-center items-center rounded-full">
                1
              </h3>
              <p className="text-sm md:text-xl font-medium">Your Pet</p>
            </div>
            <div className="flex justify-center items-center gap-3">
              <h3 className="font-bold text-2xl text-white w-7 h-7 md:w-12 md:h-12 bg-orange-500 flex justify-center items-center rounded-full">
                2
              </h3>
              <p className="text-orange-500 text-sm md:text-xl font-medium">
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
          <div className="bg-white w-full h-auto md:h-[720px] px-5 rounded-2xl p-0 md:p-10 flex flex-col gap-14 justify-between">
            <div className="flex flex-col gap-0 md:gap-10 w-full">
              <Input
                label="Your Name*"
                placeholder="Full name"
                onChange={handleFullnameChange}
                error={fullnameError}
              />
              <div className="flex flex-col md:flex-row justify-between w-full gap-0 md:gap-10">
                <div className="w-full md:w-1/2">
                  <Input
                    label="Email*"
                    placeholder="youremail@company.com"
                    onChange={handleEmailChange}
                    error={emailError}
                    errorMsg={messageErrorEmail}
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <Input
                    label="Phone*"
                    placeholder="xxx-xxx-xxxx"
                    onChange={handlePhoneChange}
                    error={phoneError}
                    errorMsg={messageErrorPhone}
                  />
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
            <div className="hidden md:flex justify-between">
              <button
                className="btn px-10 py-3 rounded-full font-bold bg-[#FFF1EC] hover:bg-[#FFF1EC] active:bg-[#FFF1EC] border-none text-orange-500"
                onClick={() => router.push("/booking")}
              >
                Back
              </button>
              <button
                className={`btn px-10 py-3 font-bold rounded-full ${
                  btndisable
                    ? "text-[#AEB1C3] bg-gray-200 cursor-not-allowed"
                    : "text-white bg-orange-500 hover:bg-orange-500"
                }`}
                onClick={handleSubmit}
                disabled={btndisable}
              >
                Next
              </button>
            </div>
          </div>

          {/* Booking Detail */}
        </div>
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
            <p className="font-medium py-4">Total</p>
            <p className="text-[18px] font-medium">600.00 THB</p>
          </div>
        </div>
        <div className="flex md:hidden justify-between mb-10">
          <button
            className="btn px-10 py-3 rounded-full font-bold bg-[#FFF1EC] hover:bg-[#FFF1EC] active:bg-[#FFF1EC] border-none text-orange-500"
            onClick={() => router.push("/booking")}
          >
            Back
          </button>
          <button
            className={`btn px-10 py-3 font-bold rounded-full ${
              btndisable
                ? "text-[#AEB1C3] bg-gray-200 cursor-not-allowed"
                : "text-white bg-orange-500 hover:bg-orange-500"
            }`}
            onClick={handleSubmit}
            disabled={btndisable}
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
