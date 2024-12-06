import Image from "next/image";
import { Listbar, MapIcon } from "@/public/assets/listbar";
import mark from "@/public/assets/mark.svg";
import search from "@/public/assets/search.svg";
import Header from "@/components/home-page/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import profiledefault from "@/public/assets/profile-default-icon.svg";
import imagebgicon from "@/public/assets/imagebg-default-icon.svg";
// import { SearchBox } from "@/components/home-page/Search";
import LoadingPage from "@/components/Loading";
import Footer from "@/components/home-page/Footer";
import { useSearchContext } from "@/context/searchbar";

interface Sitter {
  full_name: string;
  place: string;
  rating: number;
  image: string;
  pet_type_dog: string;
  pet_type_cat: string;
  pet_type_bird: string;
  pet_type_rabbit: string;
  image_1: string;
  trade_name: string;
}

export default function SearchPage() {
  const [dataPetSitters, setDataPetSitters] = useState<Array<Sitter>>([]);
  const [loading, setLoanding] = useState<boolean>(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  useEffect(() => {
    DataPet();
  }, []);
  const {
    rating: userRating,
    experience,
    textUrl,
    selectedPets,
    handlePetType,
    handleRatingChange,
    handleExperienceChange,
    clearForm,
    SearchData,
    searchInput,
  } = useSearchContext();

  const DataPet = async () => {
    let url = `api/search`;
    if (!searchInput && !textUrl && !userRating && experience === "All") {
      url = `api/search`;
    } else {
      url = `api/search?`;
      if (textUrl) url += `${textUrl}&`;
      if (userRating !== null) url += `rating=${userRating}&`;
      if (experience !== "All") url += `experience=${experience}&`;
      if (searchInput !== "") url += `trade_name=${searchInput}&`;
      url = url.slice(0, -1); // ลบ `&` สุดท้ายออก
      console.log(url);
    }

    try {
      setLoanding(true);
      const res = await axios.get(url);
      const data = await res.data.data;
      setDataPetSitters(data);
      setLoanding(false);
    } catch (error) {
      setLoanding(true);
      console.log(error);
    }
  };

  return (
    <>
      <Header />

      {dataPetSitters.length !== 0 ? (
        <div className="w-screen">
          <main className="w-screen md:container mx-auto">
            {/* Search For Pet Sitter Desktop */}
            <div className=" hidden container mx-auto py-4 md:flex justify-between items-center">
              <h1 className="text-xl font-semibold">Search For Pet Sitter</h1>
              <div className="grid grid-cols-2  gap-4  py-3">
                <button className="btn btn-outline border-orange-500 text-orange-500 hover:text-white hover:bg-orange-500 hover:border-0">
                  <Listbar /> List
                </button>
                <button className="btn btn-outline border-gray-300 text-gray-300 hover:text-white hover:bg-gray-300 hover:border-0 w-40  hidden md:flex">
                  <MapIcon /> Map
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 ">
              {/* left sidebar */}

              <form
                className=""
                onSubmit={(e) => {
                  e.preventDefault();
                  DataPet();
                }}
              >
                <div className="w-full md:w-96 md:shadow-md md:rounded-xl h-auto  md:sticky top-10">
                  <div className="space-y-6 m:pr-1 ">
                    {/* input Search */}

                    <div className="md:px-5">
                      <p className="py-5 hidden md:inline-block">Search</p>

                      <div className=" hidden md:flex w-full border border-gray-200 rounded-xl">
                        <input
                          type="text"
                          className="py-2 rounded-lg outline-none border-0 w-full ml-2"
                          onChange={(e) => SearchData(e.target.value)}
                          value={searchInput}
                        />
                        <Image
                          src={search}
                          alt="search-icon"
                          className="mr-2 ml-1 rounded-full"
                          width={20}
                          height={20}
                          loading="lazy"
                        />
                      </div>
                    </div>

                    {/* Pet Type */}
                    <div className="space-y-2 bg-gray-100 w-full  px-5 py-6 md:px-5 md:bg-white">
                      <h3 className="font-bold text-base">Pet Type:</h3>
                      <div className="flex flex-wrap gap-2">
                        {["Dog", "Cat", "Bird", "Rabbit"].map((pet) => (
                          <label
                            key={pet}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              className="checkbox border-gray-500 [--chkbg:theme(colors.orange.500)] [--chkfg:while (condition) {
                        }] checked:border-orange-500 hover:border-orange-500"
                              value={pet}
                              checked={selectedPets.includes(pet)}
                              onChange={(e) =>
                                handlePetType(e.target.value, e.target.checked)
                              }
                            />
                            <span>{pet}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Rating h*/}
                    <h3 className="font-bold text-base px-5 md:px-5">
                      Rating:
                    </h3>

                    {/* Rating Start */}

                    <div className="flex flex-wrap gap-2 px-5">
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
                          className={`border-2 border-[#DCDFED] px-2 rounded-xl cursor-pointer hover:text-orange-500 hover:border-orange-500 group md:h-9 ${
                            selectedRating === rating || userRating === rating
                              ? "text-orange-500 border-orange-500"
                              : null
                          }`}
                          // กำหนดสไตล์ให้ div มีกรอบ (border), ขอบมน (rounded-xl) และเปลี่ยนสีพื้นหลังเมื่อ hover
                          onClick={() => {
                            setSelectedRating(rating);
                            handleRatingChange(rating);
                          }}
                        >
                          <div className="rating flex items-center">
                            {/* แสดงตัวเลขของระดับคะแนน */}
                            <h1 className="text-xl mr-1">{rating}</h1>
                            {/* วนลูปเพื่อสร้าง input (radio buttons) ที่แสดงดาวตามจำนวน stars */}
                            {[...Array(stars)].map((_, index) => (
                              <input
                                key={index} // ใช้ index เป็น key สำหรับแต่ละดาว
                                name={`rating-${rating}`} // ชื่อ group ของ radio แต่ละระดับคะแนน
                                className="mask mask-star-2 bg-green-500 group-hover:bg-green-500 !transform-none"
                                // สไตล์ของ radio เป็นรูปร่างดาว และเปลี่ยนสีเมื่อ hover
                                defaultChecked={index + 1 === stars} // ทำให้ดาวสุดท้ายในระดับนั้นถูกเลือกโดยดีฟอลต์
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Experience */}
                    <div className="flex flex-col px-5">
                      <h3 className="font-bold pb-3 md:pb-5 ">Experience:</h3>
                      <select
                        className="select select-bordered w-full md:w-auto hover:border-1 text-[#7B7E8F] "
                        value={experience}
                        onChange={handleExperienceChange} // เมื่อเลือก experience
                      >
                        <option>All</option>
                        <option>0-2 Years</option>
                        <option>3-5 Years</option>
                        <option>5+ Years</option>
                      </select>
                    </div>

                    {/* Buttons Search*/}
                    <div className="inline-block w-full  gap-2 px-5 md:hidden ">
                      <button className="btn bg-orange-500 hover:bg-white hover:text-orange-500 hover:border-orange-500 rounded-full w-full text-white btn-lg ">
                        Search
                      </button>
                    </div>
                    <div className="hidden md:flex gap-2 pb-5 md:px-5">
                      <button
                        className="btn flex-1 bg-orange-100 text-orange-500 rounded-full"
                        onClick={() => clearForm()}
                      >
                        Clear
                      </button>
                      <button className="btn flex-1 bg-orange-500 text-white rounded-full">
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Search For Pet Sitter moblie */}
              <div className="container mx-auto flex flex-col items-center md:hidden">
                <h1 className="text-xl font-semibold my-4">
                  Search For Pet Sitter
                </h1>
                <div className="grid grid-cols-2 w-full gap-4 px-5 py-3">
                  <button className="btn btn-outline border-orange-500 text-orange-500 hover:text-white hover:bg-orange-500 hover:border-0 w-full md:hidden">
                    <Listbar /> List
                  </button>
                  <button className="btn btn-outline border-gray-300 text-gray-300 hover:text-white hover:bg-gray-300 hover:border-0 md:hidden">
                    <MapIcon /> Map
                  </button>
                </div>
              </div>

              {/* Card */}
              {!loading ? (
                <div className="flex-1 py-6 w-full">
                  <div className="grid grid-cols-1 md:gap-5">
                    {dataPetSitters.map((sitter, index) => (
                      <div className="card p-5 md:p-0 " key={index}>
                        <div className="card lg:card-side  shadow-2xl flex py-5 ">
                          {sitter.image_1 ? (
                            <Image
                              src={sitter.image_1}
                              alt={sitter.full_name}
                              width={200}
                              height={20}
                              className="w-[90%] h-48 lg:w-96  object-cover ml-5 rounded-xl"
                            />
                          ) : (
                            <div className="relative h-48 md:h-48 lg:h-auto w-[90%] lg:w-96 mx-auto lg:mx-0 ">
                              <Image
                                src={imagebgicon}
                                alt={sitter.full_name}
                                className="object-cover rounded-xl lg:ml-3 md:w-96"
                                width={20}
                                height={20}
                              />
                            </div>
                          )}
                          <div className=" w-[90%] lg:w-full mx-auto lg:mx-10 py-4">
                            <div className="flex justify-between w-full md:flex-col lg:flex-row">
                              <div className="flex items-center gap-5">
                                <div className="avatar">
                                  {sitter.image ? (
                                    <div className="w-12">
                                      <Image
                                        src={sitter.image}
                                        alt={sitter.full_name}
                                        width={500}
                                        height={300}
                                        className="object-cover rounded-full"
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-12 bg-gray-200 rounded-full  ">
                                      <Image
                                        src={profiledefault}
                                        alt="search-icon"
                                        className=" rounded-full"
                                        width={20}
                                        height={20}
                                      />
                                    </div>
                                  )}
                                </div>

                                <div className="">
                                  <h2 className="card-title w-auto text-lg">
                                    {sitter.trade_name}
                                  </h2>
                                  <p className="text-sm  ">
                                    By {sitter.full_name}
                                  </p>
                                </div>
                              </div>

                              <div className="rating rating-sm flex h-full py-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <input
                                    key={star}
                                    name={`rating-${star}`} // Ensure unique `name` for each sitter
                                    className={`mask mask-star-2 ${
                                      star <= sitter.rating
                                        ? "bg-green-500"
                                        : "bg-gray-200"
                                    }`}
                                    disabled
                                  />
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center text-sm gap-2  xl:py-4">
                              <Image src={mark} alt="" width={20} height={20} />
                              <h1 className="text-gray-400 py-4 md:py-4">
                                {sitter.place}
                              </h1>
                            </div>

                            <div className="flex gap-2 my-2 flex-wrap">
                              {sitter.pet_type_dog && (
                                <div className="badge bg-green-100 badge-outline text-green-500 py-4 px-4 font-medium text-base">
                                  {sitter.pet_type_dog}
                                </div>
                              )}

                              {sitter.pet_type_cat && (
                                <div className="badge bg-pink-100 badge-outline text-pink-500 py-4 px-4 font-medium text-base">
                                  {sitter.pet_type_cat}
                                </div>
                              )}

                              {sitter.pet_type_bird && (
                                <div className="badge bg-blue-100 badge-outline text-blue-500 py-4 px-4 font-medium text-base">
                                  {sitter.pet_type_bird}
                                </div>
                              )}

                              {sitter.pet_type_rabbit && (
                                <div className="badge bg-orange-100 badge-outline text-orange-500 py-4 px-4 font-medium text-base">
                                  {sitter.pet_type_rabbit}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <LoadingPage />
              )}
            </div>
          </main>
        </div>
      ) : (
        // เช็คว่าไม่มีข้อมูล
        <div className="w-screen">
          <main className="w-screen md:container mx-auto">
            {/* Search For Pet Sitter Desktop */}
            <div className=" hidden container mx-auto py-4 md:flex justify-between items-center">
              <h1 className="text-xl font-semibold">Search For Pet Sitter</h1>
              <div className="grid grid-cols-2  gap-4  py-3">
                <button className="btn btn-outline border-orange-500 text-orange-500 hover:text-white hover:bg-orange-500 hover:border-0">
                  <Listbar /> List
                </button>
                <button className="btn btn-outline border-gray-300 text-gray-300 hover:text-white hover:bg-gray-300 hover:border-0 w-40  hidden md:flex">
                  <MapIcon /> Map
                </button>
              </div>
            </div>
            <div className="md:flex ">
              {/* search bar */}
              <form
                className=""
                onSubmit={(e) => {
                  e.preventDefault();
                  DataPet();
                }}
              >
                <div className="w-full md:w-96 md:shadow-md md:rounded-xl h-auto  md:sticky top-10">
                  <div className="space-y-6 m:pr-1 ">
                    {/* input Search */}

                    <div className="md:px-5">
                      <p className="py-5 hidden md:inline-block">Search</p>

                      <div className=" hidden md:flex w-full border border-gray-200 rounded-xl">
                        <input
                          type="text"
                          className="py-2 rounded-lg outline-none border-0 w-full ml-2"
                          onChange={(e) => SearchData(e.target.value)}
                          value={searchInput}
                        />
                        <Image
                          src={search}
                          alt="search-icon"
                          className="mr-2 ml-1 rounded-full"
                          width={20}
                          height={20}
                          loading="lazy"
                        />
                      </div>
                    </div>

                    {/* Pet Type */}
                    <div className="space-y-2 bg-gray-100 w-full  px-5 py-6 md:px-5 md:bg-white">
                      <h3 className="font-bold text-base">Pet Type:</h3>
                      <div className="flex flex-wrap gap-2">
                        {["Dog", "Cat", "Bird", "Rabbit"].map((pet) => (
                          <label
                            key={pet}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              className="checkbox font-semibold bg-white"
                              value={pet}
                              checked={selectedPets.includes(pet)}
                              onChange={(e) =>
                                handlePetType(e.target.value, e.target.checked)
                              }
                            />
                            <span>{pet}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Rating h*/}
                    <h3 className="font-bold text-base px-5 md:px-5">
                      Rating:
                    </h3>

                    {/* Rating Start */}

                    <div className="flex flex-wrap gap-2 px-5">
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
                          className={`border-2 border-[#DCDFED] px-2 rounded-xl cursor-pointer hover:text-orange-500 hover:border-orange-500 group md:h-9 ${
                            selectedRating === rating || userRating === rating
                              ? "text-orange-500 border-orange-500"
                              : null
                          }`}
                          // กำหนดสไตล์ให้ div มีกรอบ (border), ขอบมน (rounded-xl) และเปลี่ยนสีพื้นหลังเมื่อ hover
                          onClick={() => {
                            setSelectedRating(rating);
                            handleRatingChange(rating);
                          }}
                        >
                          <div className="rating flex items-center">
                            {/* แสดงตัวเลขของระดับคะแนน */}
                            <h1 className="text-xl mr-1">{rating}</h1>
                            {/* วนลูปเพื่อสร้าง input (radio buttons) ที่แสดงดาวตามจำนวน stars */}
                            {[...Array(stars)].map((_, index) => (
                              <input
                                key={index} // ใช้ index เป็น key สำหรับแต่ละดาว
                                name={`rating-${rating}`} // ชื่อ group ของ radio แต่ละระดับคะแนน
                                className="mask mask-star-2 bg-green-500 group-hover:bg-green-500 !transform-none"
                                // สไตล์ของ radio เป็นรูปร่างดาว และเปลี่ยนสีเมื่อ hover
                                defaultChecked={index + 1 === stars} // ทำให้ดาวสุดท้ายในระดับนั้นถูกเลือกโดยดีฟอลต์
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Experience */}
                    <div className="flex flex-col px-5">
                      <h3 className="font-bold pb-3 md:pb-5 ">Experience:</h3>
                      <select
                        className="select select-bordered w-full md:w-auto hover:border-1 text-[#7B7E8F] "
                        value={experience}
                        onChange={handleExperienceChange} // เมื่อเลือก experience
                      >
                        <option>All</option>
                        <option>0-2 Years</option>
                        <option>3-5 Years</option>
                        <option>5+ Years</option>
                      </select>
                    </div>

                    {/* Buttons Search*/}
                    <div className="inline-block w-full  gap-2 px-5 md:hidden ">
                      <button className="btn bg-orange-500 hover:bg-white hover:text-orange-500 hover:border-orange-500 rounded-full w-full text-white btn-lg ">
                        Search
                      </button>
                    </div>
                    <div className="hidden md:flex gap-2 pb-5 md:px-5">
                      <button className="btn flex-1 bg-orange-100 text-orange-500 rounded-full">
                        Clear
                      </button>
                      <button className="btn flex-1 bg-orange-500 text-white rounded-full">
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              </form>
              <div className="flex max-w-4xl mx-auto  h-auto  items-center justify-center ">
                <div className="">ไม่มีข้อมูล</div>
              </div>
            </div>
          </main>
        </div>
      )}

      <Footer />
    </>
  );
}
