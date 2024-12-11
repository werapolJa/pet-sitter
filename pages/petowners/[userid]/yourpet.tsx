import React, { useState } from "react";
import Header from "@/components/home-page/Header";
import Footer from "@/components/home-page/Footer";
import Sidebar from "@/components/pet-owner/Sidebar";
import withAuth from "@/utils/withAuth";
import Image from "next/image";
import BackArrow from "@/public/assets/back-arrow.svg";
import IdCardInput from "@/components/pet-owner/IdCardInput";
import PhoneInput from "@/components/pet-owner/PhoneInput";
import Input from "@/components/pet-owner/Input";
function YourPet() {
  const [changeContainer, setChangeContainer] = useState<boolean>(true);

  return (
    <div>
      <Header />
      <div className="w-full md:bg-custom-gray flex flex-col md:flex-row min-h-screen ">
        <Sidebar />

        {/*  check changeContainer กดปุ่มเพ่ือเรียกคอมโพเน้น create มาแสดง */}

        {changeContainer ? (
          // container show pet
          <div className="flex flex-col w-full bg-white rounded-2xl gap-4 md:ml-8 md:mr-20 md:mt-10 md:mb-20 md:px-10 md:py-7">
            <div className="mx-4 mt-6 mb-2 flex justify-between md:mx-0 md:mt-0  ">
              {/* text your pet and button create */}
              <h3 className="py-2 text-2xl font-bold ">Your Pet</h3>
              <button
                className="px-6 py-3 text-base font-bold bg-orange-500 text-white rounded-full truncate"
                onClick={() => setChangeContainer(false)}
              >
                Create Pet
              </button>
            </div>
            {/*main card */}
            <div className="flex flex-col gap-4 items-center justify-center md:grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 ">
              {/* card show pet */}
              <div className="px-4 flex w-full md:px-0 lg:w-auto">
                <div className="card flex flex-col items-center justify-center pt-6 pb-4 text-center border-2 h-full w-full bg-white lg:w-72">
                  <div className="w-28 h-28 ">
                    <Image
                      src="https://images.unsplash.com/photo-1504826260979-242151ee45b7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="image pet"
                      width={104}
                      height={104}
                      className="rounded-full w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="py-4 text-xl font-bold">Name</h2>
                  <h2 className="text-base font-medium py-1 px-4 bg-green-100 text-green-500 rounded-full border-2 border-green-500 mb-7">
                    Type
                  </h2>
                </div>
              </div>

              <div className="px-4 flex w-full md:px-0 lg:w-auto">
                <div className="card flex flex-col items-center justify-center pt-6 pb-4 text-center border-2 h-full w-full bg-white lg:w-72">
                  <div className="w-28 h-28 ">
                    <Image
                      src="https://images.unsplash.com/photo-1504826260979-242151ee45b7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="image pet"
                      width={104}
                      height={104}
                      className="rounded-full w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="py-4 text-xl font-bold">Name</h2>
                  <h2 className="text-base font-medium py-1 px-4 bg-green-100 text-green-500 rounded-full border-2 border-green-500 mb-7">
                    Type
                  </h2>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // container create
          <div className="flex flex-col w-full bg-white rounded-2xl gap-4 md:ml-8 md:mr-20 md:mt-10 md:mb-20 md:px-10 md:py-7">
            <div className="mx-4 mt-6 mb-2 flex justify-between md:mx-0 md:mt-0  ">
              {/* text your pet and button create */}
              <div className="flex text-center justify-center items-center">
                <Image
                  src={BackArrow}
                  alt=""
                  onClick={() => setChangeContainer(true)}
                  height={28}
                  width={20}
                  className="mr-2 cursor-pointer"
                />
                <h3 className="py-2 text-2xl font-bold ">Your Pet</h3>
              </div>
            </div>
            asdasdsad
            {/* form submit add create */}
            <form className="px-4">
              {/*input Name */}
              <div className="label-text pb-2 font-bold">Pet Name*</div>
              <div className="input flex items-center  input-bordered focus-within:outline-none focus-within:border-orange-500 mb-6">
                <input type="text" placeholder="Your Name" className="w-full" />
              </div>
              {/*input Pet Type* ande Breed */}
              <div className=" flex flex-col md:flex-row md:gap-5">
                <div className="w-full md:w-1/2 ">
                  <div className="label-text pb-2 font-bold">Pet Type*</div>
                  <div className="input flex items-center  input-bordered focus-within:outline-none focus-within:border-orange-500 mb-6">
                    <input
                      type="text"
                      placeholder="Select your pet type"
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  <div className="label-text pb-2 font-bold">Breed*</div>
                  <div className="input flex items-center  input-bordered focus-within:outline-none focus-within:border-orange-500 mb-6">
                    <input
                      type="text"
                      placeholder="Breed of your pet"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              {/* input Sex and Age */}
              <div className="flex flex-col md:flex-row md:gap-5">
                <div className="w-full md:w-1/2 ">
                  <div className="label-text pb-2 font-bold">Sex*</div>
                  <div className="input flex items-center  input-bordered focus-within:outline-none focus-within:border-orange-500 mb-6">
                    <select className="w-full  focus-within:outline-none">
                      <option disabled selected className="w-full">
                        Pick your favorite Simpson
                      </option>
                      <option >Homer</option>
                      <option>Marge</option>
                      <option>Bart</option>
                      <option>Lisa</option>
                      <option>Maggie</option>
                    </select>
                  </div>
                </div>

                <div className="w-full md:w-1/2  md:mb-0">
                  <div className="label-text pb-2 font-bold">Age (Month)*</div>
                  <div className="input flex items-center  input-bordered focus-within:outline-none focus-within:border-orange-500 mb-6">
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              {/* input color and weight */}
              <div className="flex flex-col md:flex-row md:gap-5">
                <div className="w-full md:w-1/2 ">
                  <div className="label-text pb-2 font-bold">Color*</div>
                  <div className="input flex items-center  input-bordered focus-within:outline-none focus-within:border-orange-500 mb-6">
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/2  md:mb-0">
                  <div className="label-text pb-2 font-bold">
                    Weight (Kilogram)*
                  </div>
                  <div className="input flex items-center  input-bordered focus-within:outline-none focus-within:border-orange-500 mb-6">
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              {/* input About */}
              <div className="label-text pb-2 font-bold">About</div>
              <div className="input flex items-center  input-bordered focus-within:outline-none focus-within:border-orange-500 mb-6 h-auto">
                <textarea
                  className=" w-full pt-2 focus-within:outline-none"
                  placeholder="Bio"
                  rows={5}
                ></textarea>
              </div>

              {/* button cancel and create */}
              <div className="flex justify-between">
                <button
                  type="submit"
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
        )}
      </div>
      <Footer />
    </div>
  );
}
export default withAuth(YourPet);
