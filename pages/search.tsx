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
  average_rating: string | null;
  image_1: string;
  trade_name: string;
  province: string;
  district: string;
}

export default function SearchPage() {
  const [dataPetSitters, setDataPetSitters] = useState<Array<Sitter>>([]);
  const [loading, setLoanding] = useState<boolean>(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

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

  useEffect(() => {
    DataPet();
  }, []);

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
      // console.log(url);
    }

    try {
      setLoanding(true);
      const res = await axios.get(url);
      const data = await res.data.data;

      setDataPetSitters(data);
      setLoanding(false);
      // console.log(data[0]);
    } catch (error) {
      setLoanding(true);
      console.log(error);
    }
  };

  return (
    <>
      <Header />
      {/* dataPetSitters.length !== 0  */}

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
                  <h3 className="font-bold text-base px-5 md:px-5">Rating:</h3>
                  {/* Rating Start */}
                  <div className="flex flex-wrap gap-2 px-5">
                    {[
                      { rating: 5, stars: 5 },
                      { rating: 4, stars: 4 },
                      { rating: 3, stars: 3 },
                      { rating: 2, stars: 2 },
                      { rating: 1, stars: 1 },
                    ].map(({ rating, stars }) => (
                      <div
                        key={rating}
                        className={`border-2 border-[#DCDFED] px-2 rounded-xl cursor-pointer  group md:h-9 ${
                          selectedRating === rating || userRating === rating
                            ? " border-orange-500"
                            : null
                        }`}
                        onClick={() => {
                          const newRating =
                            selectedRating === rating ? null : rating;
                          // ประกาศตัวแปลเพื่อ check ว่า rating มีการกดไหม ถ้ากด ให้ส่ง rating ไป กดอีกครั้งจะเปลี่ยนค่าเป็น null ไป
                          setSelectedRating(newRating);
                          handleRatingChange(newRating);
                        }}
                      >
                        <div className="rating flex items-center">
                          <h1 className="text-xl mr-1">{rating}</h1>
                          {[...Array(stars)].map((_, index) => (
                            <input
                              key={index}
                              name={`rating-${rating}`}
                              className="mask mask-star-2 bg-green-500 group-hover:bg-green-500 !transform-none"
                              defaultChecked={index + 1 === stars}
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
                      className="select select-bordered w-full md:w-auto hover:border-1 text-[#7B7E8F] focus-within:border-orange-500 focus-within:outline-none "
                      value={experience}
                      onChange={handleExperienceChange} // เมื่อเลือก experience
                    >
                      <option>All</option>
                      <option>0-2 Years</option>
                      <option>3-5 Years</option>
                      <option>5+ Years</option>
                    </select>
                  </div>
                  {/* Buttons Search Mobile จะแสดงตอนเป็น Mobile และหายตอนเป็น Desktop*/}
                  <div className="inline-block w-full  gap-2 px-5 md:hidden ">
                    <button className="btn bg-orange-500 hover:bg-white hover:text-orange-500 hover:border-orange-500 rounded-full w-full text-white btn-lg ">
                      Search
                    </button>
                  </div>
                  {/* Buttons Clear*/}
                  <div className="hidden md:flex gap-2 pb-5 md:px-5">
                    <button
                      className="btn flex-1 bg-orange-100 text-orange-500 rounded-full"
                      onClick={() => {
                        clearForm();
                        setSelectedRating(null); // กดแล้วจะ  รีค่าของ raitng เป็น null
                      }}
                    >
                      Clear
                    </button>
                    {/* Buttons Search Desktop จะแสดงตอนเป็น Desktop และหายตอนเป็น Mobile*/}

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
              dataPetSitters.length > 0 ? (
                <div className="flex flex-col gap-4 w-full">
                  {dataPetSitters.map((sitter, index) => (
                    <div className="flex p-5 md:p-0 w-full" key={index}>
                      <div className=" shadow-2xl inline-block w-full lg:flex rounded-2xl">
                        <div className="p-4">
                          <Image
                            src={sitter.image_1 || imagebgicon}
                            alt={sitter.full_name}
                            width={500}
                            height={300}
                            className=" object-cover rounded-xl w-full h-[184px]  mx-auto md:w-[500px] "
                          />
                        </div>

                        <div className=" lg:w-full mx-auto p-4 ">
                          <div className="flex justify-between w-full lg:flex-row">
                            <div className="flex items-center gap-5 ">
                              <div className="avatar">
                                {sitter.image ? (
                                  <div className="w-16">
                                    <Image
                                      src={sitter.image}
                                      alt={sitter.full_name}
                                      width={64}
                                      height={64}
                                      className="object-cover rounded-full "
                                    />
                                  </div>
                                ) : (
                                  <div className="w-16 bg-gray-200 rounded-full ">
                                    <Image
                                      src={profiledefault}
                                      alt="search-icon"
                                      className="rounded-full"
                                      width={64}
                                      height={64}
                                    />
                                  </div>
                                )}
                              </div>
                              <div className="">
                                <h2 className="card-title w-auto text-2xl font-bold line-clamp-1">
                                  {sitter.trade_name}
                                </h2>
                              
                                <p className="text-lg font-medium ">By {sitter.full_name}</p>
                              </div>
                            </div>

                            <div className="rating rating-sm flex h-full py-1">
                              {sitter && sitter.average_rating !== null ? (
                                <div>
                                  <div className="rating flex items-center">
                                    {[1, 2, 3, 4, 5].map((star) => {
                                      // ตรวจสอบว่า sitter.average_rating เป็น number ก่อน
                                      const rating = Number(
                                        sitter.average_rating
                                      );
                                      return (
                                        <input
                                          key={star}
                                          name={`rating-${star}`}
                                          className={`mask mask-star-2 ${
                                            star <= rating
                                              ? "bg-green-500"
                                              : "bg-gray-200"
                                          }`}
                                          disabled
                                        />
                                      );
                                    })}
                                  </div>
                                </div>
                              ) : (
                                <div>No Rating</div> // กรณีไม่มีค่าของ average_rating
                              )}
                            </div>
                          </div>

                          <div className="flex items-start justify-start text-sm gap-2 my-5 sm:my-8">
                            <Image src={mark} alt="" width={20} height={20} />
                            <h1 className="text-gray-400 w-full">
                              {sitter.district} , {sitter.province}
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
              ) : (
                <div className=" flex justify-center items-center w-full !h-60 md:!h-auto mx-auto ">
                  No Data
                </div> // show no Data
              )
            ) : (
              <LoadingPage /> //show loading
            )}
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}
