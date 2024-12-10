import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import Input from "@/components/pet-owner/Input";
import { useAuth } from "@/context/authentication";

import registerSVG01 from "@/public/assets/registerpetowner01.svg";
import registerSVG02 from "@/public/assets/registerpetowner02.svg";
import registerSVG03 from "@/public/assets/registerpetowner03.svg";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [emailError, setEmailError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);

  const [messageErrorEmail, setMessageErrorEmail] = useState<string>("");
  const [messageErrorPassword, setMessageErrorPassword] = useState<string>("");

  const { loginAdmin } = useAuth()!;

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError(false);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setEmailError(false);
    setPasswordError(false);
    setMessageErrorEmail("");
    setMessageErrorPassword("");

    if (!email) {
      setEmailError(true);
      setMessageErrorEmail("Email is required.");
    }

    if (!password) {
      setPasswordError(true);
      setMessageErrorPassword("Password is required.");
    }

    if (!email || !password) return;

    try {
      await loginAdmin({ email, password });
    } catch (error) {
      if (error instanceof Error) {
        setEmailError(true);
        setPasswordError(true);
        setMessageErrorEmail(error.message);
      } else {
        setMessageErrorEmail("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="w-screen h-screen">
      <div className="w-full h-full relative">
        <Image
          src={registerSVG01}
          alt="Background icon"
          className="absolute right-0 top-0 hidden md:block"
          loading="lazy"
        />
        <Image
          src={registerSVG03}
          alt="Background icon"
          className="absolute right-0 top-0 block md:hidden"
          loading="lazy"
        />
        <Image
          src={registerSVG02}
          alt="Background icon"
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
            <h1 className="text-4xl md:text-5xl font-bold">
              Admin Panel Login
            </h1>
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
              label="Password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="*********"
              error={passwordError}
              errorMsg={messageErrorPassword}
            />
            <button
              type="submit"
              className="btn bg-orange-500 active:bg-orange-500 hover:bg-orange-500 text-white text-[16px] font-bold rounded-full"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
