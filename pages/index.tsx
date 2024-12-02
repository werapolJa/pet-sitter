'use client'
import Footer from "@/components/home-page/Footer";
import Header from "@/components/home-page/Header";
import Image from "next/image";
import Link from "next/link";

// Images
import herocat from "@/public/assets/landing-page/herocat.svg";
import herodog from "@/public/assets/landing-page/herodog.svg";
import bluesyar from "@/public/assets/landing-page/bluesyar.svg";
import pinkstar from "@/public/assets/landing-page/pinkstar.svg";
import greenstar from "@/public/assets/landing-page/greenstar.svg";
import goldenstar from "@/public/assets/landing-page/goldenstar.svg";
import catstar from "@/public/assets/landing-page/catstar.svg";
import connect from "@/public/assets/landing-page/contect/connect.svg";
import better from "@/public/assets/landing-page/contect/better.svg";
import calling from "@/public/assets/landing-page/contect/calling.svg";
import starsandcircles from "@/public/assets/landing-page/starsandcircles.svg";
import semicircle from "@/public/assets/landing-page/semicircle.svg";

export default function Home() {
  return (
    <div>
      <Header />
      <section className=" md:flex md:justify-between md:py-16">
        <div className="hidden md:block">
          <Image src={herocat} alt="herocat" />
        </div>
        <div className="flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl font-bold text-gray-800 md:text-8xl">
            Pet Sitter, <br /> Perfect, <br /> For Your Pet.
          </h1>
          <p className="py-6 text-[#7B7E8F] md:text-xl">
            Find your perfect pet sitter with us.
          </p>
        </div>
        <div className="flex relative">
          {/* md */}
          <div className="md:hidden">
            <Image src={herocat} alt="herocat" />
          </div>
          <div>
            <Image src={herodog} alt="herodog" />
          </div>
        </div>
      </section>
      {/* --------------------------------------------------------------------------------------------------------------------------------- */}
      <div className=" text-[#3A3B46] ">
        {/* Pet Type */}
        <div className="md:flex md:flex-col md:justify-start">
          <div className="md:mx-auto md:w-3/4">
            <div className="py-6 px-9 rounded-2xl md:px-0 md:bg-[#F6F6F9]">
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0">
                <h3 className="font-bold text-base  md:p-0 md:px-6">
                  Pet Type:
                </h3>
                <div className="flex gap-4">
                  {["Dog", "Cat", "Bird", "Rabbit"].map((pet) => (
                    <label key={pet} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="checkbox font-semibold bg-white"
                      />
                      <span>{pet}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col px-10 py-3 gap-4 md:flex-row md:items-center md:p-0 md:pb-16 md:justify-between">
              {/* Rating */}
              <div className="flex flex-col md:items-center gap-4 md:flex-row">
                <h3 className="font-bold text-base md:px-6 md:py-8">Rating:</h3>
                <div className="flex flex-wrap gap-2 ">
                  {[
                    // สร้าง array ที่มีค่าระดับการให้คะแนน (rating) และจำนวนดาว (stars) ที่ต้องการแสดง
                    { rating: 5, stars: 5 },
                    { rating: 4, stars: 4 },
                    { rating: 3, stars: 3 },
                    { rating: 2, stars: 2 },
                    { rating: 1, stars: 1 },
                  ].map(({ rating, stars }) => (
                    // ใช้ .map เพื่อวนลูปแต่ละ object ใน array และสร้าง UI สำหรับแต่ละระดับคะแนน
                    <div
                      key={rating} // ใช้ rating เป็น key เพื่อระบุว่า element แต่ละตัวไม่ซ้ำกัน
                      className="border-2 border-[#DCDFED] px-2 rounded-xl cursor-pointer hover:text-white hover:bg-green-500 group md:h-9"
                      // กำหนดสไตล์ให้ div มีกรอบ (border), ขอบมน (rounded-xl) และเปลี่ยนสีพื้นหลังเมื่อ hover
                    >
                      <div className="rating flex items-center">
                        {/* แสดงตัวเลขของระดับคะแนน */}
                        <h1 className="text-xl mr-1">{rating}</h1>
                        {/* วนลูปเพื่อสร้าง input (radio buttons) ที่แสดงดาวตามจำนวน stars */}
                        {[...Array(stars)].map((_, index) => (
                          <input
                            key={index} // ใช้ index เป็น key สำหรับแต่ละดาว
                            type="radio" // ระบุว่า input เป็น radio button
                            name={`rating-${rating}`} // ชื่อ group ของ radio แต่ละระดับคะแนน
                            className="mask mask-star-2 bg-green-500 group-hover:bg-white"
                            // สไตล์ของ radio เป็นรูปร่างดาว และเปลี่ยนสีเมื่อ hover
                            disabled // ปิดการใช้งาน (ไม่ให้คลิกได้)
                            defaultChecked={index + 1 === stars} // ทำให้ดาวสุดท้ายในระดับนั้นถูกเลือกโดยดีฟอลต์
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Experience */}
              <div className="flex flex-col md:items-center gap-4 md:ml-4 md:flex-row">
                <h3 className="font-bold pb-3 md:pb-0">Experience:</h3>
                <select className="select select-bordered w-full md:w-auto hover:border-1 text-[#7B7E8F]">
                  <option>0-2 Years</option>
                  <option>2-5 Years</option>
                  <option>5+ Years</option>
                </select>
              </div>

              {/* Search Button */}
              <div className="flex justify-center md:ml-4">
                <Link href="/search">
                  <button className="btn bg-orange-500 hover:bg-white hover:text-orange-500 hover:border-orange-500 rounded-full w-full text-white md:w-36">
                    Search
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* --------------------------------------------------------------------------------------------------------------------------------- */}
        <div className="flex flex-col px-4 md:items-center">
          <div className="flex justify-center py-6 text-center">
            <h1 className="text-lg font-semibold text-black md:text-3xl">
              &quot;Your Pets, Our Priority: <br className="md:hidden" />{" "}
              Perfect Care, Anytime, <br className="md:hidden" />{" "}
              Anywhere.&quot;
            </h1>
          </div>
          {/* box  Boarding*/}
          <div className="md:flex md:px-8 md:py-8">
            <div className="md:w-[504px]">
              <div className="flex ">
                <div className="px-3">
                  <Image
                    src={bluesyar}
                    alt="bluesyar"
                    className="w-6 h-6 mr-5"
                  />
                </div>
                <div className="flex-col">
                  <h1 className="text-lg font-semibold text-black">Boarding</h1>
                  <p className="text-gray-500 py-3 pb-5">
                    Your pets stay overnight in your sitter’s home. They’ll be
                    treated like part of the family in a comfortable
                    environment.
                  </p>
                </div>
              </div>
              {/* box House Sitting */}
              <div className="flex">
                <div className="px-3">
                  <Image
                    src={pinkstar}
                    alt="pinkstar"
                    className="w-6 h-6 mr-5"
                  />
                </div>
                <div className="flex-col">
                  <h1 className="text-lg font-semibold text-black">
                    House Sitting
                  </h1>
                  <p className="text-gray-500 py-3 pb-5">
                    Your sitter takes care of your pets and your home. Your pets
                    will get all the attention they need without leaving home.
                  </p>
                </div>
              </div>
              {/* box Dog Walking */}
              <div className="flex">
                <div className="px-3">
                  <Image
                    src={greenstar}
                    alt="greenstar"
                    className="w-6 h-6 mr-5"
                  />
                </div>
                <div className="flex-col">
                  <h1 className="text-lg font-semibold text-black">
                    Dog Walking
                  </h1>
                  <p className="text-gray-500 py-3 pb-5">
                    Your dog gets a walk around your neighborhood. Perfect for
                    busy days and dogs with extra energy to burn.
                  </p>
                </div>
              </div>
              {/* box Drop-In Visits */}
              <div className="flex">
                <div className="px-3">
                  <Image
                    src={goldenstar}
                    alt="goldenstar"
                    className="w-6 h-6 mr-5"
                  />
                </div>
                <div className="flex-col">
                  <h1 className="text-lg font-semibold text-black">
                    Drop-In Visits
                  </h1>
                  <p className="text-gray-500 py-3 pb-5">
                    Your sitter drops by your home to play with your pets, offer
                    food, and give potty breaks or clean the litter box.
                  </p>
                </div>
              </div>
            </div>
            <div className="md:px-8">
              <Image src={catstar} alt="catstar" className="mx-auto" />
            </div>
          </div>
        </div>
        {/* ------------------------------------------------------------------------------------------------------------------------------------------ */}
        <div className="flex-col justify-center items-center px-4 h-full md:flex md:flex-row md:justify-between md:px-20">
          {/* connect */}
          <div className="text-center">
            <Image src={connect} alt="connect" className="mx-auto py-8" />
            <div>
              <h1 className="text-xl font-bold mt-4 text-black">
                <span className="text-green-500">Connect</span> With Sitters
              </h1>
              <p className="text-gray-500 mt-2 md:w-80">
                Find a verified and reviewed sitter who’ll keep your pets
                company and give time.
              </p>
            </div>
          </div>
          {/* better */}
          <div className="text-center">
            <Image src={better} alt="better" className="mx-auto py-8" />
            <div>
              <h1 className="text-xl font-bold mt-4 text-black">
                <span className="text-blue-500">Better</span> For Your Pets
              </h1>
              <p className="text-gray-500 mt-2 md:w-80">
                Pets stay happy at home with a sitter who gives them loving care
                and companionship.
              </p>
            </div>
          </div>
          {/* Calling */}
          <div className="text-center">
            <Image src={calling} alt="calling" className="mx-auto py-8" />
            <div>
              <h1 className="text-xl font-bold mt-4 text-black">
                <span className="text-orange-500">Calling</span> All Pets
              </h1>
              <p className="text-gray-500 mt-2 md:w-80">
                Stay for free with adorable animals in unique homes around the
                world.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* ---------------------------------------------------------------------------------------------------------------------------------- */}
      <div className="bg-[#FFF5EC] relative overflow-hidden flex flex-col items-center py-8 md:m-20 rounded-2xl">
        {/* ภาพ starsandcircles ด้านบน */}
        <Image
          src={starsandcircles}
          alt="starsandcircles"
          className="absolute top-0 right-0 w-44"
        />
        {/* เนื้อหา */}
        <div className="relative z-10 text-center flex flex-col items-center gap-6 py-20">
          <h1 className="text-2xl md:text-4xl font-bold">
            Perfect Pet Sitter <br /> For Your Pet
          </h1>
          <div className="md:flex">
            <button className=" text-orange-500 py-2 px-4 rounded-md">
              Become A Pet Sitter
            </button>
            <Link href="/search">
              <button className="btn bg-orange-500 hover:bg-white hover:text-orange-500 hover:border-orange-500 rounded-full w-80 md:w-40 text-white ">
                Find A Pet Sitter
              </button>
            </Link>
          </div>
        </div>

        {/* ภาพ semicircle ด้านล่าง */}
        <Image
          src={semicircle}
          alt="semicircle"
          className="absolute bottom-0 left-0 w-52"
        />
      </div>
      <Footer />
    </div>
  );
}
