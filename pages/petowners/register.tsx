import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import Input from "@/components/pet-owner/Input";
import axios from "axios";
import { useAuth } from "@/context/authentication";

import registerSVG01 from "@/public/assets/registerpetowner01.svg";
import registerSVG02 from "@/public/assets/registerpetowner02.svg";
import registerSVG03 from "@/public/assets/registerpetowner03.svg";


export default function Register() {
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [emailError, setEmailError] = useState<boolean>(false);
  const [phoneError, setPhoneError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);

  const [messageErrorEmail, setMessageErrorEmail] = useState<string>("");
  const [messageErrorPhone, setMessageErrorPhone] = useState<string>("");

  const { register } = useAuth()!;

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError(false)
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
    setPhoneError(false)
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError(false)
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setEmailError(false);
    setPhoneError(false);
    setPasswordError(false);

    if (!email) {
      setEmailError(true);
    }
    if (!email.includes("@")) {
      setEmailError(true);
      setMessageErrorEmail("Invalid Email");
    }

    if (!phone) setPhoneError(true);
    if (!password) setPasswordError(true);

    try {
      const data = {
        email,
        password,
        phone
      }
      await register?.(data)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if(error.response?.data?.error.includes("email")){
          setEmailError(true)
          setMessageErrorEmail(`${error.response?.data?.error}`)
        }else if(error.response?.data?.error.includes("phone")){
          setPhoneError(true)
          setMessageErrorPhone(`${error.response?.data?.error}`)
        }
      } 
    }
  };
  
  return (
    <div className="w-screen h-screen">
      <div className="w-full h-full relative">
        <Image
          src={registerSVG01}
          alt="ิbackground icon"
          className="absolute right-0 top-0 hidden md:block"
          loading="lazy"
        />
        <Image
          src={registerSVG03}
          alt="ิbackground icon"
          className="absolute right-0 top-0 block md:hidden"
          loading="lazy"
        />
        <Image
          src={registerSVG02}
          alt="ิbackground icon"
          className="absolute left-0 bottom-0 hidden md:block"
          loading="lazy"
        />
      </div>

      <div className="absolute top-0 left-0 z-10 w-full h-full flex justify-center items-center px-4 md:px-0">
        <form
          className="w-[440px] flex flex-col gap-14 text-center"
          onSubmit={handleSubmit}
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold">Join Us!</h1>
            <h3 className="text-gray-400">
              Find your perfect pet sitter with us
            </h3>
          </div>
          <div className="w-full flex flex-col gap-6">
            <Input
              label="Email"
              type="text"
              value={email}
              onChange={handleEmailChange}
              placeholder="email@company.com"
              error={emailError}
              errorMsg={messageErrorEmail}
            />
            <Input
              label="Phone"
              type="text"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="Your phone number"
              error={phoneError}
              errorMsg={messageErrorPhone}
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Create your password"
              error={passwordError}
            />
            <button
              type="submit"
              className="btn bg-orange-500 active:bg-orange-500 hover:bg-orange-500 text-white text-[16px] font-bold rounded-full"
            >
              Register
            </button>
            <p className="font-medium text-[18px]">
              Already have an account?{" "}
              <Link
                href="/petowners/login"
                className="font-bold text-[16px] text-orange-500"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
