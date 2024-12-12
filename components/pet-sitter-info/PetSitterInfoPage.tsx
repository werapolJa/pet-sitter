import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/free-mode";

// Import required modules
import { FreeMode, Pagination, Navigation } from "swiper/modules";

import petSitter1 from "@/public/assets/pet-sitter-info-page/petsitter-1.svg";
import petSitter2 from "@/public/assets/pet-sitter-info-page/petsitter-2.svg";
import petSitter3 from "@/public/assets/pet-sitter-info-page/petsitter-3.svg";
import arrowLeft from "@/public/assets/pet-sitter-info-page/arrow-left.svg";
import arrowRight from "@/public/assets/pet-sitter-info-page/arrow-right.svg";
import petSitterProfile from "@/public/assets/pet-sitter-info-page/pet-sitter-profile.svg";
import pinAddress from "@/public/assets/pet-sitter-info-page/pin-address.svg";

export default function PetSitterInfoPage() {
  return (
    <div className="w-full bg-custom-gray min-h-screen font-sans tracking-wide">
      <PetSitterCarousel />
      <PetSitterInformation />
    </div>
  );
}

const PetSitterCarousel: React.FC = () => {
  // State for controlling the number of slides per view
  const [slidesPerView, setSlidesPerView] = useState(1);

  // Detect screen size and adjust slidesPerView
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSlidesPerView(1); // For mobile screens
      } else {
        setSlidesPerView(2.25); // For desktop screens
      }
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const petImages = [
    { image: petSitter1, title: "Pet Sitter 1" },
    { image: petSitter2, title: "Pet Sitter 2" },
    { image: petSitter3, title: "Pet Sitter 3" },
    { image: petSitter1, title: "Pet Sitter 1" },
    { image: petSitter2, title: "Pet Sitter 2" },
    { image: petSitter3, title: "Pet Sitter 3" },
  ];

  return (
    <div className="relative w-full md:py-10">
      <Swiper
        slidesPerView={slidesPerView}
        spaceBetween={16}
        loop={true}
        centeredSlides={true}
        navigation={{
          prevEl: ".swiper-button-prev", // Custom left button class
          nextEl: ".swiper-button-next", // Custom right button class
        }}
        modules={[FreeMode, Pagination, Navigation]}
        className="mySwiper"
      >
        {petImages.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full md:h-[413px] h-[281px] z-10">
              <Image
                src={slide.image}
                alt={slide.title}
                className="object-cover w-full h-full"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom left button */}
      <div className="opacity-50 md:opacity-100 swiper-button-prev absolute left-12 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-14 h-14 rounded-full bg-white z-20 cursor-pointer">
        <Image
          src={arrowLeft}
          alt="Previous"
          width={10}
          height={18}
          className="w-2.5 h-4.5"
        />
      </div>

      {/* Custom right button */}
      <div className="opacity-50 md:opacity-100 swiper-button-next absolute right-14 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-14 h-14 rounded-full bg-white z-50 cursor-pointer">
        <Image
          src={arrowRight}
          alt="Next"
          width={10}
          height={18}
          className="w-2.5 h-4.5"
        />
      </div>

      <style jsx global>{`
        .swiper-pagination-bullet-active {
          background-color: #ff7037 !important;
        }
        .swiper-slide {
          height: auto;
        }
        .swiper-button-prev::after,
        .swiper-button-next::after {
          display: none;
        }
      `}</style>
    </div>
  );
};

const PetSitterInformation: React.FC = () => {
  const petSitterInfo = {
    tradename: "Happy House!",
    fullname: "Jane Maison",
    experience: "1.5",
    rating: 5,
    address: { district: "Senanikom", province: "Bangkok" },
    pet_type1: "Dog",
    pet_type2: "Cat",
    pet_type3: "Bird",
    pet_type4: "Rabbit",
    introduction:
      "Hello there! My name is Jane Maison, and I'm your friendly and reliable pet sitter in Senanikom, Bangkok. I am passionate about animals and have dedicated myself to ensuring the well-being and happiness of your furry, feathery, and hoppy companions. With a big heart and a spacious house, I provide a safe and loving environment for cats, dogs, and rabbits while you're away. Let me introduce myself and tell you a bit more about the pet care services I offer.",
    service: `🐱 Cat Sitting: Cats are fascinating creatures, and I take joy in catering to their independent yet affectionate nature. Whether your feline friend needs playtime, cuddles, or just a cozy spot to relax, I ensure they feel right at home.

🐶 Dog Sitting: Dogs are not just pets; they're family. From energetic walks and engaging playtime to soothing belly rubs, I provide a balanced and fun experience for dogs of all sizes and breeds. Safety and happiness are my top priorities.

🐇 Rabbit Sitting: With their adorable antics and gentle personalities, rabbits require a special kind of care. I am well-versed in providing them with a comfortable environment, appropriate diet, and ample playtime to keep them content and hopping with joy.`,
    myplace:
      "My residence is a spacious house nestled in the serene neighborhood of Senanikom. Your beloved pets will have plenty of room to roam and explore while enjoying a safe and secure environment. I have designated areas for play, relaxation, and sleep, ensuring your pets feel comfortable and at ease throughout their stay.",
    image: petSitterProfile,
  };

  const servicesArray = petSitterInfo.service.split(/\n\s*\n/); // Split based on double line breaks
  const maxStars = 5;
  const petTypeStyles: { [key: string]: string } = {
    Dog: "flex h-8 items-center justify-center text-base leading-6 font-medium text-green-500 bg-green-100 border border-green-500 rounded-[99px] py-1 px-4",
    Cat: "flex h-8 items-center justify-center text-base leading-6 font-medium text-pink-500 bg-pink-100 border border-pink-500 rounded-[99px] py-1 px-4",
    Bird: "flex h-8 items-center justify-center text-base leading-6 font-medium text-blue-500 bg-blue-100 border border-blue-500 rounded-[99px] py-1 px-4",
    Rabbit:
      "flex h-8 items-center justify-center text-base leading-6 font-medium text-orange-400 bg-orange-100 border border-orange-400 rounded-[99px] py-1 px-4",
  };

  const renderPetType = (petType: string | null) => {
    if (!petType) return null;
    return (
      <div key={petType} className={`${petTypeStyles[petType]}`}>
        {petType}
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="px-4 py-10 md:pt-6 md:px-20 md:w-[58%] md:ml-20">
        <div>
          <h1 className="text-4xl md:text-[3.5rem] font-bold">
            {petSitterInfo.tradename}
          </h1>
          <h3 className="mt-6 mb-3 md:mb-3 text-xl md:text-2xl font-bold  md:mt-12">
            Introduction
          </h3>
          <p className="text-justify leading-6 md:leading-7 text-sm md:text-base text-gray-500">
            {petSitterInfo.introduction}
          </p>
          <h3 className="mt-6 mb-3 md:mb-3 text-xl md:text-2xl font-bold  md:mt-12">
            Services
          </h3>
          {servicesArray.map((service, index) => (
            <p
              key={index}
              className="text-justify leading-6 md:leading-7 mb-6 md:mb-7 text-sm md:text-base text-gray-500"
            >
              {service}
            </p> // Render each service item in a new paragraph
          ))}
          <h3 className="mt-6 mb-3 md:mb-3 text-xl md:text-2xl font-bold md:mt-12">
            My Place
          </h3>
          <p className="text-justify leading-6 md:leading-7 text-sm md:text-base text-gray-500">
            {petSitterInfo.myplace}
          </p>
        </div>
      </div>
      {/* Profile Card */}
      <div className="md:sticky md: top-10 md:mb-12  w-[full] h-[500px] md:h-[562px] bg-white flex flex-col md:w-[416px] md:mr-20 md:rounded-2xl md:ml-auto md:shadow-lg">
        <div className="flex flex-col items-center justify-center mt-10">
          <Image
            src={petSitterProfile}
            alt="Pet Sitter Image"
            width={120}
            height={120}
            className="w-30 h-30 md:w-[160px] md:h-[160px] rounded-full "
          />
          <h3 className="mt-6 text-2xl md:text-4xl leading-8 font-bold md:leading-10">
            {petSitterInfo.tradename}
          </h3>
          <div className="flex items-center gap-2 mt-[2px] md:mt-[4px]">
            <span className="text-lg md:text-xl leading-6 md:leading-7 font-medium md:font-bold">
              {petSitterInfo.fullname}
            </span>
            <span className="text-base leading-7 font-medium text-green-500">
              {petSitterInfo.experience} Years Exp.
            </span>
          </div>
          <div className="rating">
            {Array.from({ length: maxStars }, (_, index) => (
              <input
                key={index}
                type="radio"
                name="rating"
                className={`mask mask-star-2 ${
                  index < petSitterInfo.rating ? "bg-green-500" : "bg-gray-300"
                } w-[16px] h-4 md:h-5 md:w-5 p-[6px] mx-[2px] my-[6px] md:mt-[6px] md:mb-3 md:gap-[2px]`}
                readOnly
                disabled
              />
            ))}
          </div>
          <div className="mt-3 flex flex-row items-center gap-2">
            <Image
              src={pinAddress}
              alt="Pin Address"
              width={11}
              height={14}
              className="w-[11px] h-[14px] md:w-4 md:h-5"
            />
            <span className="text-gray-400 text-sm leading-6 font-medium md:text-base md:font-medium">
              {petSitterInfo.address.district}, {petSitterInfo.address.province}
            </span>
          </div>
          <div className="mt-4 flex flex-row items-center gap-2.5">
            {renderPetType(petSitterInfo.pet_type1)}
            {renderPetType(petSitterInfo.pet_type2)}
            {renderPetType(petSitterInfo.pet_type3)}
            {renderPetType(petSitterInfo.pet_type4)}
          </div>
          <div className="w-full h-[96px] border-t border-t-gray-200  flex items-center justify-center mt-10">
            <button className="text-base leading-6 font-bold w-full md:w-[368px] h-[48px] bg-orange-500 text-white rounded-[99px] m-6">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
