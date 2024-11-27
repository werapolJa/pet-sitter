import Image from "next/image";
import { Listbar, MapIcon } from "@/public/assets/listbar";
import Link from "next/link";

interface Sitter {
  name: string;
  location: string;
  rating: number;
  petTypes: string[];
  imageUrl: string;
  title: string;
}

export default function Search() {
  const SITTERS: Sitter[] = [
    {
      name: "Jane Maison",
      location: "Senanikorn, Bangkok",
      rating: 5,
      petTypes: ["Dog", "Cat", "Rabbit"],
      imageUrl:
        "https://images.unsplash.com/photo-1732282537685-bec9036bf4e0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Happy House!",
    },
    {
      name: "Cat Lover",
      location: "Senanikorn, Bangkok",
      rating: 4,
      petTypes: ["Cat"],
      imageUrl:
        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
      title: "We love cat and your cat",
    },
    {
      name: "Umai",
      location: "Senanikorn, Bangkok",
      rating: 5,
      petTypes: ["Dog", "Cat", "Bird", "Rabbit"],
      imageUrl:
        "https://images.unsplash.com/photo-1732282537685-bec9036bf4e0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Gentle >< for all pet! (Kid friendly)",
    },
  ];
  return (
    <div className="min-h-screen ">
      {/* Search For Pet Sitter Desktop */}
      <div className=" hidden  container mx-auto px-8 py-4 md:flex justify-between items-center ">
        <h1 className="text-xl font-semibold">Search For Pet Sitter</h1>
        <div className="join">
          <button className="btn btn-outline border-orange-500 text-orange-500 hover:text-white hover:bg-orange-500 hover:border-0">
            <Listbar /> List
          </button>
          <button className="btn btn-sm join-item btn-ghost">//icon</button>
        </div>
      </div>

      <main className="w-screen md:container mx-auto ">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-64 md:border-r ">
            <div className="space-y-6 m:pr-1 ">
              <input
                type="text"
                placeholder="Search"
                className="hidden md:inline w-full pl-3 pr-10 py-2 border rounded-lg"
              />

              {/* Pet Type */}
              <div className="space-y-2 bg-gray-100 w-full md:bg-white px-10 py-6 skeleton ">
                <h3 className="font-bold text-base">Pet Type:</h3>
                <div className="flex flex-wrap gap-2">
                  {["Dog", "Cat", "Bird", "Rabbit"].map((pet) => (
                    <label key={pet} className="flex items-center space-x-5 ">
                      <input
                        type="checkbox"
                        className="checkbox font-semibold"
                      />
                      <span>{pet}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <h3 className="font-bold text-base px-10 ">Rating:</h3>
              <div className="flex flex-wrap gap-3 px-10">
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

                <div className="border-2 border-blue-5 inline px-2 py-3  rounded-xl cursor-pointer hover:text-white hover:bg-green-500  group">
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

                <div className="border-2 border-blue-5 inline px-2 py-3  rounded-xl cursor-pointer hover:text-white hover:bg-green-500  group">
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

                <div className="border-2 border-blue-5 inline px-2 py-3  rounded-xl cursor-pointer hover:text-white hover:bg-green-500  group">
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
              <div className="space-y-2 px-10 pt-3 ">
                <h3 className="font-bold pb-3">Experience:</h3>
                <select className="select select-bordered w-full hover:border-1 ">
                  <option>0-2 Years</option>
                  <option>2-5 Years</option>
                  <option>5+ Years</option>
                </select>
              </div>

              {/* Buttons Search*/}
              <div className="inline-block w-full  gap-2 px-10 md:hidden ">
                <button className="btn bg-orange-500 hover:bg-white hover:text-orange-500 hover:border-orange-500 rounded-full w-full text-white btn-lg ">
                  Search
                </button>
              </div>
              <div className="hidden md:flex gap-2 px-10 py-6 ">
                <button className="btn btn-ghost flex-1">Clear</button>
                <button className="btn btn-primary flex-1">Search</button>
              </div>
            </div>
          </div>

          {/* Search For Pet Sitter moblie */}
          <div className="container mx-auto flex flex-col items-center md:hidden">
            <h1 className="text-xl font-semibold my-4">
              Search For Pet Sitter
            </h1>
            <div className="grid grid-cols-2 w-full gap-4 px-10 py-3">
              <button className="btn btn-outline border-orange-500 text-orange-500 hover:text-white  hover:bg-orange-500 hover:border-0 w-full md:hidden ">
                <Listbar /> List
              </button>
              <button className="btn btn-outline border-gray-300 text-gray-300 hover:text-white  hover:bg-gray-300 hover:border-0  md:hidden ">
                <MapIcon /> Map
              </button>
            </div>
          </div>

          {/* Card */}
          <div className="flex-1 px-10 py-6">
            <div className="grid grid-cols-1 gap-10 ">
              {SITTERS.map((sitter) => (
                <div className="card bg-base-100 shadow-md">
                  <div className="relative h-40 sm:h-48  w-[90%] mx-auto ">
                    <Image
                      src="https://images.unsplash.com/photo-1732282537685-bec9036bf4e0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt={sitter.name}
                      fill
                      className="object-cover rounded-xl"
                    />
                  </div>

                  <div className="card-body">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-5">
                     
                        <div className="avatar">
                          <div className="w-10 rounded-full">
                            <img src={sitter.imageUrl} />
                          </div>
                        </div>
                        <div className="">
                          <h2 className="card-title w-auto">{sitter.title}</h2>
                          <p className="text-sm text-muted-foreground">
                            By {sitter.name}
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

                    <div className="flex items-center text-sm text-muted-foreground">
                      {sitter.location}
                    </div>
                    <div className="flex gap-2 my-2">
                      {sitter.petTypes.map((type) => (
                        <span
                          key={type}
                          className="badge badge-primary badge-outline"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
