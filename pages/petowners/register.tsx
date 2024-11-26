import Image from "next/image";
import registerSVG01 from "@/public/images/registerpetowner01.svg";
import registerSVG02 from "@/public/images/registerpetowner02.svg";
import Link from "next/link";

export default function Register() {
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
          src={registerSVG02}
          alt="logo"
          className="absolute left-0 bottom-0 hidden md:block"
          priority
        />
      </div>

      <div className="flex justify-center items-center w-full h-full absolute top-0 left-0 z-10">
        <div className="w-[440px] text-center flex flex-col gap-14">
          <div>
            <h1 className="font-bold text-5xl">Join Us!</h1>
            <h3 className="text-gray-400">
              Find your perfect pet sitter with us
            </h3>
          </div>
          <div className="w-full flex flex-col gap-6">
            <label className="form-control">
              <div className="label">
                <span className="label-text text-base font-normal">Email</span>
              </div>
              <input
                type="text"
                placeholder="email@company.com"
                className="input input-bordered focus:border-orange-500 focus:outline-orange-500"
              />
            </label>
            <label className="form-control">
              <div className="label">
                <span className="label-text text-base font-normal">Phone</span>
              </div>
              <input
                type="text"
                placeholder="Your phone number"
                className="input input-bordered focus:border-orange-500 focus:outline-orange-500"
              />
            </label>
            <label className="form-control">
              <div className="label">
                <span className="label-text text-base font-normal">
                  Password
                </span>
              </div>
              <input
                type="password"
                placeholder="Create your password"
                className="input input-bordered focus:border-orange-500 focus:outline-orange-500"
              />
            </label>
            <button className="btn bg-orange-500 active:bg-orange-500 hover:bg-orange-500 text-white text-[16px] font-bold rounded-full">
              Register
            </button>
            <p className="font-medium text-[18px]">Already have an account? <Link href="/petowners/login" className="font-bold text-[16px] text-orange-500">Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
