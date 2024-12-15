import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import dynamic from "next/dynamic";
import axios from "axios";
import { useRouter } from "next/router";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/free-mode";

// Import required modules
import { FreeMode, Pagination, Navigation } from "swiper/modules";

import arrowLeft from "@/public/assets/pet-sitter-info-page/arrow-left.svg";
import arrowRight from "@/public/assets/pet-sitter-info-page/arrow-right.svg";
import petSitterProfile from "@/public/assets/pet-sitter-info-page/pet-sitter-profile.svg";
import pinAddress from "@/public/assets/pet-sitter-info-page/pin-address.svg";

interface Address {
  district: string;
  province: string;
}

interface PetSitterInfo {
  tradename: string;
  fullname: string;
  experience: string;
  rating: number;
  address: Address;
  latitude: number;
  longitude: number;
  pet_type1?: string | null;
  pet_type2?: string | null;
  pet_type3?: string | null;
  pet_type4?: string | null;
  introduction: string;
  service: string;
  myplace: string;
  image: string;
}

export default function PetSitterInfoPage() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [image, setImage] = useState<string[]>([]);
  const [tradename, setTradname] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [experience, setExperience] = useState<string>("");
  const [introduction, setIntroduction] = useState<string>("");
  const [service, setService] = useState<string>("");
  const [place, setPlace] = useState<string>("");
  const [petTypeDog, setPetTypeDog] = useState<string>("");
  const [petTypeCat, setPetTypeCat] = useState<string>("");
  const [petTypeBird, setPetTypeBird] = useState<string>("");
  const [petTypeRabbit, setPetTypeRabbit] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { petsitterid } = router.query;

  useEffect(() => {
    if (!router.isReady || !petsitterid) {
      setError("Petsitter ID is missing or invalid.");
      return;
    }

    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `/api/petsitters/petsitterprofile/${petsitterid}?status=Approved`
        );

        if (response.status === 200) {
          const data = response.data.data;

          setProfileImage(data.image);
          setTradname(data.trade_name);
          setName(data.full_name);
          setExperience(data.experience);
          setIntroduction(data.intro);
          setService(data.service);
          setPlace(data.place);
          setPetTypeDog(data.pet_type_dog);
          setPetTypeCat(data.pet_type_cat);
          setPetTypeBird(data.pet_type_bird);
          setPetTypeRabbit(data.pet_type_rabbit);

          const validImages = data.images.filter(
            (image: string) => image.trim() !== ""
          );

          setImage(validImages);
        } else {
          setError("No images available for this petsitter.");
        }
      } catch (error: unknown) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data.");
        setProfileImage(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router.isReady, petsitterid]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="w-full bg-custom-gray min-h-screen font-sans tracking-wide">
      <PetSitterCarousel images={image} />
      <PetSitterInformation
        image={profileImage}
        tradename={tradename}
        name={name}
        experience={experience}
        introduction={introduction}
        service={service}
        place={place}
        petTypeDog={petTypeDog}
        petTypeCat={petTypeCat}
        petTypeBird={petTypeBird}
        petTypeRabbit={petTypeRabbit}
      />
    </div>
  );
}

const PetSitterCarousel: React.FC<{ images: string[] }> = ({ images }) => {
  const fallbackImage =
    "https://boeraqxraijbxhlrtdnn.supabase.co/storage/v1/object/public/image/pet-sitter-default-yellow.png";

  let adjustedImages: string[];

  if (images.length === 0) {
    // No images: Use 6 fallback images
    adjustedImages = new Array(6).fill(fallbackImage);
  } else if (images.length === 5) {
    // Exactly 5 images: Duplicate the middle image
    const middleImage = images[Math.floor(images.length / 2)];
    adjustedImages = [...images, middleImage];
  } else if (images.length < 6) {
    // Fewer than 6 images (excluding 5): Duplicate images until length is 6
    adjustedImages = [...images];
    let index = 0;
    while (adjustedImages.length < 6) {
      adjustedImages.push(images[index % images.length]); // Duplicate images cyclically
      index++;
    }
  } else {
    // 6 or more images: Use the images as they are
    adjustedImages = images;
  }

  return (
    <div className="relative w-full md:py-10">
      <Swiper
        slidesPerView={1}
        spaceBetween={16}
        breakpoints={{
          768: {
            // Media query for `md`
            slidesPerView: 2.25,
          },
        }}
        loop={true}
        centeredSlides={true}
        navigation={{
          prevEl: ".swiper-button-prev", // Custom left button class
          nextEl: ".swiper-button-next", // Custom right button class
        }}
        modules={[FreeMode, Pagination, Navigation]}
        className="mySwiper"
      >
        {adjustedImages.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full md:h-[413px] h-[281px] z-10">
              <img
                src={image} // Use a correct relative path
                alt={`Pet Sitter Image ${index + 1}`}
                className="object-cover w-full h-full"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom left button */}
      <div className="opacity-50 md:opacity-100 swiper-button-prev absolute md:left-20 left-4 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-14 h-14 rounded-full bg-white z-20 cursor-pointer">
        <Image
          src={arrowLeft}
          alt="Previous"
          width={10}
          height={18}
          className="w-2.5 h-4.5"
        />
      </div>

      {/* Custom right button */}
      <div className="opacity-50 md:opacity-100 swiper-button-next absolute md:right-20 right-4 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-14 h-14 rounded-full bg-white z-50 cursor-pointer">
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

const PetSitterInformation: React.FC<{
  image: string | null;
  tradename: string;
  name: string;
  experience: string;
  introduction: string;
  place: string;
  service: string;
  petTypeDog: string;
  petTypeCat: string;
  petTypeBird: string;
  petTypeRabbit: string;
}> = ({
  image,
  tradename,
  name,
  experience,
  introduction,
  service,
  place,
  petTypeDog,
  petTypeCat,
  petTypeBird,
  petTypeRabbit,
}) => {
  const petSitterInfo = {
    tradename: "Happy House!",
    fullname: "Jane Maison",
    experience: "1.5",
    rating: 4.1,
    address: { district: "Senanikom", province: "Bangkok" },
    latitude: 13.815,
    longitude: 100.571,
    pet_type1: "Dog",
    pet_type2: "Cat",
    pet_type3: null,
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

  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/pet-sitter-info/PetSitterMap"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  const formatServiceDescription = (text: string) => {
    const safeText = text || "";
    return safeText.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="px-4 py-10 md:pt-6 md:px-20 md:w-[58%] md:ml-20">
        <div>
          <h1 className="text-4xl md:text-[3.5rem] font-bold">{tradename}</h1>
          <h3 className="mt-6 mb-3 md:mb-3 text-xl md:text-2xl font-bold  md:mt-12">
            Introduction
          </h3>
          <p className="text-justify leading-6 md:leading-7 text-sm md:text-base text-gray-500">
            {introduction}
          </p>
          <h3 className="mt-6 mb-3 md:mb-3 text-xl md:text-2xl font-bold  md:mt-12">
            Services
          </h3>
          <div className="service-description text-justify leading-6 md:leading-7 mb-6 md:mb-7 text-sm md:text-base text-gray-500">
            {formatServiceDescription(service)}
          </div>
          <h3 className="mt-6 mb-3 md:mb-3 text-xl md:text-2xl font-bold md:mt-12">
            My Place
          </h3>
          <p className="text-justify leading-6 md:leading-7 text-sm md:text-base text-gray-500">
            {place}
          </p>
          <Map
            latitude={petSitterInfo.latitude}
            longitude={petSitterInfo.longitude}
            tradename={petSitterInfo.tradename}
          />
          <div className="hidden md:block">
            <PetSitterReview />
          </div>
        </div>
      </div>
      <div className="md:hidden">
        <ProfileCard
          petSitterInfo={petSitterInfo}
          image={image}
          tradename={tradename}
          name={name}
          experience={experience}
          petTypeDog={petTypeDog}
          petTypeCat={petTypeCat}
          petTypeBird={petTypeBird}
          petTypeRabbit={petTypeRabbit}
        />
      </div>
      <div className="md:hidden">
        <PetSitterReview />
      </div>
      <div className="hidden md:block md:w-1/4 md:mb-20">
        <div className="sticky top-4">
          <ProfileCard
            petSitterInfo={petSitterInfo}
            image={image}
            tradename={tradename}
            name={name}
            experience={experience}
            petTypeDog={petTypeDog}
            petTypeCat={petTypeCat}
            petTypeBird={petTypeBird}
            petTypeRabbit={petTypeRabbit}
          />
        </div>
      </div>
    </div>
  );
};

const ProfileCard: React.FC<{
  petSitterInfo: PetSitterInfo;
  image: string | null;
  tradename: string;
  name: string;
  experience: string;
  petTypeDog: string;
  petTypeCat: string;
  petTypeBird: string;
  petTypeRabbit: string;
}> = ({
  petSitterInfo,
  image,
  tradename,
  name,
  experience,
  petTypeDog,
  petTypeCat,
  petTypeBird,
  petTypeRabbit,
}) => {
  const fallbackImage =
    "https://boeraqxraijbxhlrtdnn.supabase.co/storage/v1/object/public/image/pet-sitter-default-yellow.png";
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
    <div>
      {/* Profile Card */}
      <div className="md:sticky md: top-10 md:mb-12  w-[full] h-[500px] md:h-[562px] bg-white flex flex-col md:w-[416px] md:mr-20 md:rounded-2xl md:ml-auto md:shadow-lg">
        <div className="flex flex-col items-center justify-center mt-10">
          <img
            src={image || fallbackImage}
            alt="Pet Sitter Image"
            width={120}
            height={120}
            className="w-30 h-30 md:w-[160px] md:h-[160px] rounded-full object-cover"
          />
          <h3 className="mt-6 text-2xl md:text-4xl leading-8 font-bold md:leading-10">
            {tradename}
          </h3>
          <div className="flex items-center gap-2 mt-[2px] md:mt-[4px]">
            <span className="text-lg md:text-xl leading-6 md:leading-7 font-medium md:font-bold">
              {name}
            </span>
            <span className="text-base leading-7 font-medium text-green-500">
              {experience}
            </span>
          </div>
          <div className="rating">
            {Array.from({ length: maxStars }, (_, index) => (
              <input
                key={index}
                type="radio"
                name="rating"
                className={`mask mask-star-2 ${
                  index < petSitterInfo.rating ? "bg-green-500" : "hidden"
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
            {renderPetType(petTypeDog ?? null)}
            {renderPetType(petTypeCat ?? null)}
            {renderPetType(petTypeBird ?? null)}
            {renderPetType(petTypeRabbit ?? null)}
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

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const PetSitterReview: React.FC = () => {
  const mockUpReview = {
    petsitterId: 1,
    totalReviews: 6,
    averageRating: 4.1,
    reviews: [
      {
        petOwnerId: 101,
        profileImage:
          "https://s3-alpha-sig.figma.com/img/43b1/5482/86c799b1fda22cdd2d9919fd41096aeb?Expires=1734912000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=idE~gw-MTTtBz1i~0cMDotT27hzVRjgORQ3wODfLBgRf5pKTM~u2gWSlx-B6edN14IsnQcaaf~ccBQ2bDRG1FLnKKSP0yr5pTC6nC9kgNPDUAlOyXulnf18pNj6VBLOFGvIAvTwCb5o-2~XIYxjTdNwhfnGvVBPSuLZmWtc5uLk9wMDBYBesaPoPO9-6dW02WuaS3FVokjZvpKpMKni-Shw9eNsnz71mfzcP8~eSXbnlKHOemS2-RXmO6Gpmyv-hWBhdugtwvXnbNBKUrWanbZpJYWrl9ryIwinZcLdU2GlWZCn38Ts7xlaA1S-Wb8nwHHWOX7qHfIH6oZht2ydOyA__",
        name: "David M.",
        reviewDate: "2023-08-16",
        rating: 4,
        details:
          "I recently had the pleasure of entrusting Jane Maison with the care of my two energetic Labrador Retrievers, Max and Bella, while I was away on a business trip. I can confidently say that Jane exceeded all my expectations as a pet sitter.",
      },
      {
        petOwnerId: 102,
        profileImage:
          "https://s3-alpha-sig.figma.com/img/b31b/f20a/dfa1574f6c3afd42efaa1f5841395d90?Expires=1734912000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ItAoaXyH3gLnNoJXAkikjuxT~b0ajvRtcf020Q~-MzTe11h8LUqA1lnP5lEF4ALrPzVsEgByrqq~wPA7NCTnDAphoALRitE5tZ4AtoyaF5CjBiZS~4OZpF~a~vbmjY4JaYi5IUuK8ChTHHpBsukV~S9R6AuiiIUbt4ja9xoNrqgMFO-Bm0IezzoS~HLeS2qP2CK1dp4-2tU6B2NFEQiFLApXZ1blCXtbe4VqYMtBlLpeHNZAlRmI~BauacKu73Hre2Lfekn3MT03vM6NzT4xihjR7hFq6g9gHfWkwiGV7f2dlkCNmZPauKTDnhlbzMQ~mUJfI9OCXUm0w5loRrkgFA__",
        name: "Emily B.",
        reviewDate: "2023-08-18",
        rating: 5,
        details:
          "I cannot express how grateful I am to have found Jane Maison as a pet sitter for my cat, Whiskers. Jane took the time to understand Whiskers' routines, likes, and quirks. During my recent vacation, she provided regular updates, including photos of Whiskers playing, lounging, and even eating his favorite treats. It was evident that Whiskers was not only well-cared for but was also enjoying his time with Jane.",
      },
      {
        petOwnerId: 103,
        profileImage:
          "https://s3-alpha-sig.figma.com/img/3f2d/cb19/644ab4c80deba63f323d10a6a1628ba5?Expires=1734912000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=pKRLRUXmZDF9o2VJD~de9y1GpJaYYlktkQCpVr4qlNbeDPWuD4rQdTND7Hgz311v6dKhROk4lyEeGFn251CQrUfJnVpAcHsE3TJpMIBIqrOYrWmF~6bKFrsR5RmDHd6uP7jmQU1oyrP10~3ulVB7Z03PA6dGMbfF0SFgi~xj3zRyAlu9VCEMDjbMINgVENsjya4Rc9wlNLBIh5UMJruf5OzO-n16T7SJmRNdKPhAsSrnnEMrp4p7tyC9rGUsR5FtTyywsC9WhhruOip26tKkwSFfb1~J0fjJ79cggw4EgmgsXILhFmrPbnNPRnNZ28YTlBbLWCZSLGpaUso15nwxjQ__",
        name: "Sarah K.",
        reviewDate: "2023-08-20",
        rating: 3,
        details:
          "Jane Maison did a great job looking after my energetic dog, Buddy. While I was away, she made sure Buddy got his exercise and kept up with his feeding schedule. I appreciated the updates she sent, although I would have liked a bit more frequent communication. Overall, I'm satisfied with her service and would consider using her again in the future.",
      },
      {
        petOwnerId: 104,
        profileImage:
          "https://s3-alpha-sig.figma.com/img/de64/da3c/945cf7048edb6a29cc0657c051082f75?Expires=1734912000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=IdlcRpFKVaET9fAAsw5J3EyBL735N4IpoaFWpTFkQRBxrEXyUh63K4GOZ63ck9FF5ys-3FSQv4XRjuUaVYL8azG~ajSVHmvjyQQo0T6HKRGEvGmVBmysQ-mFLeAChNocZcDbTLqDLegbZEC1ydac9BTV4y67QD10VgAVHtDdBaw8Q6vroj8cnO3ixQZTtANEHhICMLeBjQoJtiRT07a05baQ377DU4vQXr~4IpkvOuRQ~bgQHqRYFrxaN2HhuDacuEqYh7DnIF19TpqM0kHd~tMeZSkZZXKHu779XpTU-yhw3u-5jb3v4gz6uZfSD5aElZ-B4ajfxlTy49mCwPyGbQ__",
        name: "Lora H.",
        reviewDate: "2023-08-22",
        rating: 2,
        details:
          "Not satisfied. My pet seemed stressed when I returned, and Jane wasn’t responsive.",
      },
      {
        petOwnerId: 105,
        profileImage:
          "https://s3-alpha-sig.figma.com/img/8199/e155/d24115af988a09e5528de928a7f7d058?Expires=1734912000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=VO0IFBw684H5B8p4Mi7LE-mQZo6pMX1~iZCiDQTz8bmj8WlK1IgsfqkOLflWbywTcsivLKWNl3K9UEdCFJ8cBOweNeMFlnk9laBX0F~LSkjaPYeEWcGAKqpToYMXRpz0Mgfjr~2dQatZU8~Ql7rqyIlT978-LKtQFFl7SpAVsM7KOwRQqImzA1r4SsMHdMvASFGHvdari3N1PF1nM7xP9LpJxNVCXSBPGKoE26RLsL1TJIoxQA7-UdwnhTH0w4M0~79RJK71Unm7MZ2OyQRoe-J3UDtvFNtzhgcMp~CpcB8P7qgstGhlFvHSFsAPKp1db6jrFLhptwCn7SbGNu74Lw__",
        name: "John C.",
        reviewDate: "2023-08-23",
        rating: 4,
        details:
          "Jane Maison is a lifesaver! She took care of my rambunctious rabbit, Flopsy, while I was away on vacation. Flopsy can be quite picky, but Jane knew just how to keep her happy and entertained. I received adorable photos of Flopsy munching on her favorite greens and exploring new play areas. I'm so grateful to have found Jane, and I highly recommend her pet sitting services!",
      },
      {
        petOwnerId: 101,
        profileImage:
          "https://s3-alpha-sig.figma.com/img/43b1/5482/86c799b1fda22cdd2d9919fd41096aeb?Expires=1734912000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=idE~gw-MTTtBz1i~0cMDotT27hzVRjgORQ3wODfLBgRf5pKTM~u2gWSlx-B6edN14IsnQcaaf~ccBQ2bDRG1FLnKKSP0yr5pTC6nC9kgNPDUAlOyXulnf18pNj6VBLOFGvIAvTwCb5o-2~XIYxjTdNwhfnGvVBPSuLZmWtc5uLk9wMDBYBesaPoPO9-6dW02WuaS3FVokjZvpKpMKni-Shw9eNsnz71mfzcP8~eSXbnlKHOemS2-RXmO6Gpmyv-hWBhdugtwvXnbNBKUrWanbZpJYWrl9ryIwinZcLdU2GlWZCn38Ts7xlaA1S-Wb8nwHHWOX7qHfIH6oZht2ydOyA__",
        name: "David M.",
        reviewDate: "2023-08-24",
        rating: 4,
        details:
          "Jane Maison took care of my dog, during my vacation. While my dog seemed fine when I returned, I wish there had been more communication and updates about his well-being.",
      },
    ],
  };

  return (
    <div>
      <div className="md:rounded-tl-[120px]  md:rounded-tr-[16px]  flex bg-gray-100 md:mt-10">
        <div className="md:m-6 flex flex-col md:flex-row w-full h-[374px] md:h-[194px] m-4 bg-white rounded-tl-[99px] md:rounded-bl-[99px] rounded-tr-[12px] rounded-bl-[12px] rounded-br-[12px]">
          <div className="flex flex-col items-center justify-center mt-6 ml-6 md:mr-6 md:w-[30%]  w-[146px] h-[146px] bg-black rounded-tl-[99px] rounded-tr-[99px] rounded-bl-[99px]">
            <span className="text-white text-4xl font-bold leading-10">
              {mockUpReview.averageRating.toFixed(1)}
            </span>
            <span className="text-white text-sm font-medium leading-6">
              {mockUpReview.totalReviews} Reviews
            </span>
          </div>
          <div className="md:flex-col">
            <h4 className="text-xl font-bold ml-6 mt-4">Rating & Reviews</h4>

            <div className="items-center justify-start mx-6 space-y-2">
              {["All Reviews", 5, 4, 3, 2, 1].map((rating, index) => (
                <div
                  key={index}
                  className={`rating mr-2 h-8 items-center justify-center text-base border rounded-lg p-2 gap-[2px] ${
                    rating === "All Reviews"
                      ? "border-orange-500 text-orange-500"
                      : "border-gray-200"
                  }`}
                >
                  <span>{rating === "All Reviews" ? rating : `${rating}`}</span>
                  {[...Array(rating === "All Reviews" ? 0 : rating)].map(
                    (_, i) => (
                      <input
                        key={i}
                        type="radio"
                        name={`rating-${rating}`}
                        className="mask mask-star-2 bg-green-500 w-5 h-5"
                        readOnly
                        disabled
                      />
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="review-section">
        {mockUpReview.reviews.map((review, index) => (
          <div key={index} className="flex flex-col bg-gray-100 px-4">
            <div className="flex flex-row mb-4 pt-6">
              <img
                className="w-8 h-8  rounded-full mr-4 object-cover"
                src={review.profileImage}
                alt={review.name}
              />
              <div className="flex flex-col flex-grow md:flex-grow-0">
                <span className="text-lg font-medium">{review.name}</span>
                <div className="text-sm font-medium text-gray-400">
                  {formatDate(review.reviewDate)}
                </div>
              </div>
              <div className="flex rating h-8 text-base p-2 gap-[2px] md:ml-14">
                {[...Array(review.rating)].map((_, i) => (
                  <input
                    key={i}
                    type="radio"
                    name={`rating-${review.name}`}
                    className="mask mask-star-2 bg-green-500 w-3 h-3 md:w-5 md:h-5"
                    readOnly
                    disabled
                  />
                ))}
              </div>
            </div>
            <div className="w-full md:flex md:justify-end border-b border-b-gray-200">
              <p className="pb-6 md:w-2/3 md:mr-8 text-justify text-sm font-medium text-gray-500 leading-6 ">
                {review.details}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
