import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import Input from "@/components/pet-owner/Input";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";

import registerSVG01 from "@/public/images/registerpetowner01.svg";
import registerSVG02 from "@/public/images/registerpetowner02.svg";
import registerSVG03 from "@/public/images/registerpetowner03.svg";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [emailError, setEmailError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);

  const router = useRouter();

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setEmailError(false);
    setPasswordError(false);

    if (!email) setEmailError(true);
    if (!password) setPasswordError(true);

    try {
      const response = await axios.post("/api/petowners/auth/login", {
        email,
        password,
      });
        const token = response.data.access_token;
        localStorage.setItem("token", token);
        router.push("/");
    } catch (error) {
      console.log(error);
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
            <h1 className="text-4xl md:text-5xl font-bold">Welcome back!</h1>
            <h3 className="text-gray-400">
              Find your perfect pet sitter with us
            </h3>
          </div>
          <div className="w-full flex flex-col gap-6">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="email@company.com"
              error={emailError}
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
              Login
            </button>
            <div className="flex justify-between">
              <div className="form-control">
                <label className="label cursor-pointer flex gap-2">
                  <input type="checkbox" className="checkbox" />
                  <span className="label-text text-[16px] font-semibold">
                    Remember?
                  </span>
                </label>
              </div>
              <Link
                href="/petowners/login"
                className="text-orange-500 font-bold text-[16px]"
              >
                Forget Password?
              </Link>
            </div>
            <p className="font-medium text-[18px]">
              Don’t have any account?{" "}
              <Link
                href="/petowners/register"
                className="font-bold text-[16px] text-orange-500"
              >
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
