import { Listbar, MapIcon } from "@/public/assets/listbar";
import Image from "next/image";
import search from "@/public/assets/search.svg";
import { useState } from "react";

function SearchBox({}) {
  const [searchInput,setSearchInput] = useState<string>("")
  const SearchData=(e: React.MouseEvent<HTMLButtonElement>)=>{
    console.log(e.target);
    

  }
  return (
    <div className="w-full md:w-96 md:shadow-md md:rounded-xl h-full">
      <div className="space-y-6 m:pr-1 ">
        {/* input Search */}

        <div className="md:px-5">
          <p className="py-5 hidden md:inline-block">Search</p>

          <div className=" hidden md:flex w-full border border-gray-200 rounded-xl">
          <input
              type="text"
              className="py-2 rounded-lg outline-none border-0 w-full ml-2"
              onChange={(e) => setSearchInput(e.target.value)}
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
              <label key={pet} className="flex items-center space-x-2">
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
            <div className="rating">
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

          <div className="border-2 border-blue-5 inline px-2 py-3 rounded-xl cursor-pointer hover:text-white hover:bg-green-500 group">
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

          <div className="border-2 border-blue-5 inline px-2 py-3 rounded-xl cursor-pointer hover:text-white hover:bg-green-500 group">
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
  );
}
export {SearchBox}
