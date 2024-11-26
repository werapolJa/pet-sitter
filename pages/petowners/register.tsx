import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";

import registerSVG01 from "@/public/images/registerpetowner01.svg";
import registerSVG02 from "@/public/images/registerpetowner02.svg";
import registerSVG03 from "@/public/images/registerpetowner03.svg";

export default function Register() {
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault(); 
    alert(`${email}`); 
  };

  return (
    <div className="w-screen h-screen">
      <div className="w-full h-full relative">
        <Image
          src={registerSVG01}
          alt="logo"
          className="absolute right-0 top-0 hidden md:block"
          priority
        />
        <Image
          src={registerSVG03}
          alt="logo"
          className="absolute right-0 top-0 block md:hidden"
          priority
        />
        <Image
          src={registerSVG02}
          alt="logo"
          className="absolute left-0 bottom-0 hidden md:block"
          priority
        />
      </div>

      <div className="absolute top-0 left-0 z-10 w-full h-full flex justify-center items-center px-4 md:px-0">
        <form className="w-[440px] flex flex-col gap-14 text-center" onSubmit={handleSubmit}>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold">Join Us!</h1>
            <h3 className="text-gray-400">Find your perfect pet sitter with us</h3>
          </div>
          <div className="w-full flex flex-col gap-6">
            <label className="form-control">
              <div className="label">
                <span className="label-text text-base font-medium">Email</span>
              </div>
              <input
                type="email"
                placeholder="email@company.com"
                className="input input-bordered focus:border-orange-500 focus:outline-orange-500"
                value={email}
                onChange={handleEmailChange}
              />
            </label>
            <label className="form-control">
              <div className="label">
                <span className="label-text text-base font-medium">Phone</span>
              </div>
              <input
                type="text"
                placeholder="Your phone number"
                className="input input-bordered focus:border-orange-500 focus:outline-orange-500"
                value={phone}
                onChange={handlePhoneChange}
              />
            </label>
            <label className="form-control">
              <div className="label">
                <span className="label-text text-base font-medium">Password</span>
              </div>
              <input
                type="password"
                placeholder="Create your password"
                className="input input-bordered focus:border-orange-500 focus:outline-orange-500"
                value={password}
                onChange={handlePasswordChange}
              />
            </label>
            <button
              type="submit"
              className="btn bg-orange-500 active:bg-orange-500 hover:bg-orange-500 text-white text-[16px] font-bold rounded-full"
            >
              Register
            </button>
            <p className="font-medium text-[18px]">
              Already have an account?{" "}
              <Link href="/petowners/login" className="font-bold text-[16px] text-orange-500">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
