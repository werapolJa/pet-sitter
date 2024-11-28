import Image from "next/image";
import { Listbar, MapIcon } from "@/public/assets/listbar";
import mark from "@/public/assets/mark.svg";
import search from "@/public/assets/search.svg";
import Header from "@/components/home-page/Header";
import { useEffect, useState } from "react";
import axios from "axios";
interface Sitter {
  full_name: string;
  place: string;
  rating: number;
  image:string;
  pet_type1: string;
  pet_type2: string;
  pet_type3: string;
  pet_type4: string;
  image_1: string;
  title: string;
}

export default function SearchPage() {
  const [dataPetSitters, setDataPetSitters] = useState<Array<Sitter>>([]);
  console.log(dataPetSitters);

  useEffect(() => {
    DataPet();
  }, []);
  const DataPet = async () => {
    try {
      const res = await axios.get(`api/search?pet_type=dog`);
      const data = await res.data.data;
      setDataPetSitters(data);
    } catch (error) {}
  };

  // const SITTERS: Sitter[] = [
  //   {
  //     name: "Jane Maison",
  //     location: "Senanikorn, Bangkok",
  //     rating: 5,
  //     petTypes: ["Dog", "Cat", "Rabbit"],
  //     imageUrl:
  //       "https://images.unsplash.com/photo-1732282537685-bec9036bf4e0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     title: "Happy House!",
  //   },
  //   {
  //     name: "Cat Lover",
  //     location: "Senanikorn, Bangkok",
  //     rating: 4,
  //     petTypes: ["Cat"],
  //     imageUrl:
  //       "https://images.unsplash.com/photo-1732282537685-bec9036bf4e0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     title: "We love cat and your cat",
  //   },
  //   {
  //     name: "Umai",
  //     location: "Senanikorn, Bangkok",
  //     rating: 5,
  //     petTypes: ["Dog", "Cat", "Bird", "Rabbit"],
  //     imageUrl:
  //       "https://images.unsplash.com/photo-1732282537685-bec9036bf4e0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     title: "Gentle >< for all pet! (Kid friendly)",
  //   },
  // ];
  return (
    <>
      <Header />
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

          <div className="flex flex-col md:flex-row gap-6 bg-">
            <div className="">
              <div className="w-full h-auto md:w-96 md:shadow-md md:rounded-xl">
                <div className="space-y-6 m:pr-1 ">
                  {/* input Search */}

                  <div className="md:px-5">
                    <p className="py-5 hidden  md:inline-block">Search</p>

                    <div className=" hidden  md:flex w-full border border-gray-200 rounded-xl">
                      <input
                        type="text"
                        placeholder=""
                        className="  py-2  rounded-lg outline-none border-0 w-full ml-2"
                      />
                      <Image
                        src={search}
                        alt="search-icon"
                        className="mr-2 ml-1 rounded-full"
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
                          />
                          <span>{pet}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  <h3 className="font-bold text-base px-5 md:px-5">Rating:</h3>
                  <div className="flex flex-wrap gap-3 px-5 md:px-5">
                    <div className="border-2 border-blue-5 inline px-2 py-3  rounded-xl cursor-pointer hover:text-white hover:bg-green-500  group">
                      <div className="rating ">
                        <h1 className="text-xl mr-1">5</h1>
                        <input
                          type="radio"
                          name="rating-1"
                          className="mask mask-star-2 bg-green-500 group-hover:bg-white"
                          disabled
                        />
                        <input
                          type="radio"
                          name="rating-1"
                          className="mask mask-star-2 bg-green-500 group-hover:bg-white"
                          disabled
                        />
                        <input
                          type="radio"
                          name="rating-1"
                          className="mask mask-star-2 bg-green-500 group-hover:bg-white"
                          disabled
                        />
                        <input
                          type="radio"
                          name="rating-1"
                          className="mask mask-star-2 bg-green-500 group-hover:bg-white"
                          disabled
                        />
                        <input
                          type="radio"
                          name="rating-1"
                          className="mask mask-star-2 bg-green-500 group-hover:bg-white"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="border-2 border-blue-5 inline px-2 py-3  rounded-xl cursor-pointer hover:text-white hover:bg-green-500 group">
                      <div className="rating">
                        <h1 className="text-xl mr-1">4</h1>
                        <input
                          type="radio"
                          name="rating-1"
                          className="mask mask-star-2 bg-green-500 group-hover:bg-white"
                          disabled
                        />
                        <input
                          type="radio"
                          name="rating-1"
                          className="mask mask-star-2 bg-green-500 group-hover:bg-white"
                          disabled
                        />
                        <input
                          type="radio"
                          name="rating-1"
                          className="mask mask-star-2 bg-green-500 group-hover:bg-white"
                          disabled
                        />
                        <input
                          type="radio"
                          name="rating-1"
                          className="mask mask-star-2 bg-green-500 group-hover:bg-white"
                          disabled
                          defaultChecked
                        />
                      </div>
                    </div>

                    <div className="border-2 border-blue-5 inline px-2 py-3  rounded-xl cursor-pointer hover:text-white hover:bg-green-500 group">
                      <div className="rating">
                        <h1 className="text-xl mr-1">3</h1>
                        <input
                          type="radio"
                          name="rating-1"
                          className="mask mask-star-2 bg-green-500 group-hover:bg-white"
                          disabled
                        />
                        <input
                          type="radio"
                          name="rating-1"
                          className="mask mask-star-2 bg-green-500 group-hover:bg-white"
                          disabled
                        />
                        <input
                          type="radio"
                          name="rating-1"
                          className="mask mask-star-2 bg-green-500 group-hover:bg-white"
                          disabled
                          defaultChecked
                        />
                      </div>
                    </div>

                    <div className="border-2 border-blue-5 inline px-2 py-3  rounded-xl cursor-pointer hover:text-white hover:bg-green-500 group">
                      <div className="rating">
                        <h1 className="text-xl mr-1">2</h1>
                        <input
                          type="radio"
                          name="rating-1"
                          className="mask mask-star-2 bg-green-500 group-hover:bg-white"
                          disabled
                        />
                        <input
                          type="radio"
                          name="rating-1"
                          className="mask mask-star-2 bg-green-500 group-hover:bg-white"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="border-2 border-blue-5 inline px-2 py-3  rounded-xl cursor-pointer hover:text-white hover:bg-green-500  group">
                      <div className="rating">
                        <h1 className="text-xl mr-1">1</h1>
                        <input
                          type="radio"
                          name="rating-1"
                          className="mask mask-star-2 bg-green-500 group-hover:bg-white"
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="space-y-2 px-5 pt-3 md:px-5">
                    <h3 className="font-bold pb-3">Experience:</h3>
                    <select className="select select-bordered w-full hover:border-1 text-gray-400">
                      <option>0-2 Years</option>
                      <option>2-5 Years</option>
                      <option>5+ Years</option>
                    </select>
                  </div>

                  {/* Buttons Search*/}
                  <div className="inline-block w-full  gap-2 px-5 md:hidden">
                    <button className="btn bg-orange-500 hover:bg-white hover:text-orange-500 hover:border-orange-500 rounded-full w-full text-white btn-lg ">
                      Search
                    </button>
                  </div>
                  <div className="hidden md:flex gap-2 px-5 py-6 md:px-5">
                    <button className="btn flex-1 bg-orange-100 text-orange-500 rounded-full">
                      Clear
                    </button>
                    <button className="btn flex-1 bg-orange-500 text-white rounded-full">
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>

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
            <div className="flex-1 py-6 w-full">
              <div className="grid grid-cols-1 gap-10 ">
                {dataPetSitters.map((sitter, index) => (
                  <div className="card p-5 md:p-0" key={index}>
                    <div className="card lg:card-side  shadow-xl p-2">
                      <div className="relative h-48 w-[90%] lg:w-64 mx-auto">
                        <Image
                          src={sitter.image_1}
                          alt={sitter.full_name}
                          layout="fill"
                          className="object-cover rounded-xl mt-3 ml-0 lg:ml-3 md:w-96"
                        />
                      </div>

                      <div className="card-body">
                        <div className="flex justify-between items-center  w-full md:flex-col lg:flex-row md:w-auto">
                          <div className="flex items-center gap-5">
                            <div className="avatar">
                              <div className="w-12 ">
                                <Image
                                  src={sitter.image}
                                  alt={sitter.full_name}
                                  layout="fill"
                                  className="object-cover rounded-full"
                                />
                              </div>
                            </div>

                            <div className="">
                              <h2 className="card-title w-auto">
                                {sitter.title}
                              </h2>
                              <p className="text-sm text-muted-foreground">
                                By {sitter.full_name}
                              </p>
                            </div>
                          </div>

                          <div className="rating rating-sm flex h-full py-1">
                            <input
                              type="radio"
                              name="rating-4"
                              className="mask mask-star-2 bg-green-500 group-hover:bg-white "
                              disabled
                            />
                            <input
                              type="radio"
                              name="rating-1"
                              className="mask mask-star-2 bg-green-500 group-hover:bg-white"
                              disabled
                            />
                            <input
                              type="radio"
                              name="rating-1"
                              className="mask mask-star-2 bg-green-500 group-hover:bg-white"
                              disabled
                            />
                            <input
                              type="radio"
                              name="rating-1"
                              className="mask mask-star-2 bg-green-500 group-hover:bg-white"
                              disabled
                            />
                            <input
                              type="radio"
                              name="rating-1"
                              className="mask mask-star-2 bg-green-500 group-hover:bg-white"
                              disabled
                            />
                          </div>
                        </div>

                        <div className="flex items-center text-sm gap-2  xl:py-4">
                          <Image src={mark} alt="" />
                          <h1 className="text-gray-400">{sitter.place}</h1>
                        </div>

                        <div className="flex gap-2 my-2">
                          {/* {sitter.petTypes.map((type) => (
                            <span
                              key={type}
                              className={
                                type === "Dog"
                                  ? "badge bg-green-100 badge-outline text-green-500 py-2 px-4 font-medium text-base"
                                  : type === "Cat"
                                  ? "badge badge-secondary badge-outline "
                                  : type === "Rabbit"
                                  ? "badge badge-error badge-outline"
                                  : "badge badge-info badge-outline"
                              }
                            >
                              {type}
                            </span>
                          ))} */}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
