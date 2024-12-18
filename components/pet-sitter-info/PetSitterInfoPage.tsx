import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import dynamic from "next/dynamic";
import axios from "axios";
import { useRouter } from "next/router";
import { Pagination as MuiPagination } from "@mui/material";
import DateAndTimePicker from "@/components/pet-sitter-info/DateTimePicker"; // Corrected import statement
import dayjs from "dayjs";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/free-mode";

// Import required modules
import { FreeMode, Pagination, Navigation } from "swiper/modules";

import arrowLeft from "@/public/assets/pet-sitter-info-page/arrow-left.svg";
import arrowRight from "@/public/assets/pet-sitter-info-page/arrow-right.svg";
import pinAddress from "@/public/assets/pet-sitter-info-page/pin-address.svg";
import closeIcon from "@/public/assets/pet-sitter-info-page/close.svg";

interface Review {
  image: string | null; // image can be a string or null
  rating: number;
  review: string;
  user_id: string;
  full_name: string;
  rating_id: number;
  created_at: string;
}

interface PetSitterReviewProps {
  averageRating: number | null;
  totalReviews: number | null;
  reviews: Review[];
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
  const [province, setProvince] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [latitude, setLatitude] = useState<number>(0); // Set initial value to 0 (Not null)
  const [longitude, setLongitude] = useState<number>(0); // Set initial value to 0 (Not null)
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [totalReviews, setTotalReviews] = useState<number | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [errorDate, setErrorDate] = useState<string | null>(null);

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
          setProvince(data.province);
          setDistrict(data.district);
          setLatitude(data.latitude);
          setLongitude(data.longitude);

          const validImages = data.images.filter(
            (image: string) => image.trim() !== ""
          );

          setImage(validImages);
        } else {
          setError("No images available for this petsitter.");
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setError("Petsitter profile not found.");
        } else {
          setError("Error fetching user data.");
        }
        setProfileImage(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router.isReady, petsitterid]);

  // Second useEffect: Fetch Reviews for the Pet Sitter
  useEffect(() => {
    if (!petsitterid) return;

    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `/api/reviews/${petsitterid}?status=Approved`
        );

        if (response.status === 200) {
          const data = response.data.data;

          // Set the average rating if available
          if (data.average_rating !== null) {
            setAverageRating(data.average_rating);
          } else {
            setAverageRating(null);
          }

          if (data.total_reviews !== null) {
            setTotalReviews(data.total_reviews);
          } else {
            setTotalReviews(null);
          }

          if (data.reviews && data.reviews.length > 0) {
            setReviews(data.reviews);
          } else {
            setReviews([]);
          }
        } else if (response.status === 404) {
          console.log("No reviews available for this petsitter.");
          setReviews([]);
          setAverageRating(null);
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          console.log("No reviews found for this petsitter (404).");
          setReviews([]);
          setAverageRating(null);
        } else {
          console.error("Error fetching reviews:", error);
        }
      }
    };

    fetchReviews();
  }, [petsitterid]);

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
        province={province}
        district={district}
        latitude={latitude}
        longitude={longitude}
        averageRating={averageRating}
        totalReviews={totalReviews}
        reviews={reviews}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        errorDate={errorDate}
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
    <div className="relative z-0 w-full md:py-10">
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
  province: string;
  district: string;
  latitude: number;
  longitude: number;
  averageRating: number | null;
  totalReviews: number | null;
  reviews: Review[]; // Change this to `Review[]` type
  selectedDate: string | Date | null;
  setSelectedDate: (date: Date | null) => void;
  errorDate: string | null;
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
  province,
  district,
  latitude,
  longitude,
  averageRating,
  totalReviews,
  reviews,
  selectedDate,
  setSelectedDate,
  errorDate,
}) => {
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
      <div className="px-4 py-10 md:pt-6 md:pl-20 md:w-[848px] md:ml-20">
        <div className="md:w-[688px]">
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
            latitude={latitude}
            longitude={longitude}
            tradename={tradename}
          />
          <div className="hidden md:block md:relative md:w-[calc(100% + 80px)] md:-mx-[80px]">
            <PetSitterReview
              averageRating={averageRating}
              totalReviews={totalReviews ?? 0}
              reviews={reviews}
            />
          </div>
        </div>
      </div>
      <div className="md:hidden">
        <ProfileCard
          image={image}
          tradename={tradename}
          name={name}
          experience={experience}
          petTypeDog={petTypeDog}
          petTypeCat={petTypeCat}
          petTypeBird={petTypeBird}
          petTypeRabbit={petTypeRabbit}
          province={province}
          district={district}
          averageRating={averageRating}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          errorDate={errorDate}
        />
      </div>
      <div className="md:hidden">
        <PetSitterReview
          averageRating={averageRating}
          totalReviews={totalReviews ?? 0}
          reviews={reviews}
        />
      </div>
      <div className="hidden md:block md:mb-20 md:ml-auto">
        <div className="sticky top-4">
          <ProfileCard
            image={image}
            tradename={tradename}
            name={name}
            experience={experience}
            petTypeDog={petTypeDog}
            petTypeCat={petTypeCat}
            petTypeBird={petTypeBird}
            petTypeRabbit={petTypeRabbit}
            province={province}
            district={district}
            averageRating={averageRating}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            errorDate={errorDate}
          />
        </div>
      </div>
    </div>
  );
};

const ProfileCard: React.FC<{
  image: string | null;
  tradename: string;
  name: string;
  experience: string;
  petTypeDog: string;
  petTypeCat: string;
  petTypeBird: string;
  petTypeRabbit: string;
  province: string;
  district: string;
  averageRating: number | null;
  selectedDate: string | Date | null;
  setSelectedDate: (date: Date | null) => void;
  errorDate: string | null;
}> = ({
  image,
  tradename,
  name,
  experience,
  petTypeDog,
  petTypeCat,
  petTypeBird,
  petTypeRabbit,
  province,
  district,
  averageRating,
  selectedDate,
  setSelectedDate,
  errorDate,
}) => {
  const { push } = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<"login" | "booking" | null>(
    null
  );

  useEffect(() => {
    const token = localStorage.getItem("token"); // Replace with cookie or your preferred storage
    setIsLoggedIn(!!token); // Set login status
  }, []);

  // Click handler for "Book Now"
  const handleBookNowClick = () => {
    if (isLoggedIn) {
      setShowDialog("booking"); // Open booking dialog
    } else {
      setShowDialog("login"); // Open login/register dialog
    }
  };

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

  const formattedDate = selectedDate
    ? dayjs(selectedDate).format("DD MMM, YYYY")
    : null;

  const handleDateChange = (date: string | null) => {
    setSelectedDate(date ? new Date(date) : null); // Convert string to Date
  };

  const handleSubmit = () => {
    if (selectedDate) {
      if (selectedDate instanceof Date) {
        console.log("Selected Date:", selectedDate.toISOString()); // Convert Date to ISO string
      } else {
        console.log("Selected Date:", selectedDate); // If it's already a string
      }
    } else {
      console.log("No date selected");
    }
  };

  return (
    <div>
      {/* Profile Card */}
      <div className="md:sticky md: top-10 md:mb-12  w-full h-[570px] md:h-[562px] bg-white flex flex-col md:w-[416px] md:mr-20 md:rounded-2xl md:ml-auto md:shadow-lg">
        <div className="flex flex-col items-center justify-center mt-10">
          <img
            src={image || fallbackImage}
            alt="Pet Sitter Image"
            width={120}
            height={120}
            className="w-30 h-30 md:w-[160px] md:h-[160px] rounded-full object-cover h-[120px]"
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
                  index < Math.round(averageRating ?? 0)
                    ? "bg-green-500"
                    : "hidden"
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
              {district}, {province}
            </span>
          </div>
          <div className="mt-4 flex flex-row items-center gap-2.5">
            {renderPetType(petTypeDog ?? null)}
            {renderPetType(petTypeCat ?? null)}
            {renderPetType(petTypeBird ?? null)}
            {renderPetType(petTypeRabbit ?? null)}
          </div>
          <div className="w-full md:w-[416px] flex flex-col items-center justify-center md:flex md:flex-row border-t border-t-gray-200 mt-10 md:gap-4">
            <button className="text-base leading-6 font-bold w-[328px] md:w-[176px] h-[48px] bg-orange-100 text-orange-500 rounded-[99px] mt-6 md:my-6">
              Send Message
            </button>
            <button
              className="text-base leading-6 font-bold w-[328px] md:w-[176px] h-[48px] bg-orange-500 text-white rounded-[99px] my-6 md:my-0"
              onClick={handleBookNowClick}
            >
              Book Now
            </button>

            {showDialog === "login" && (
              <div className="fixed z-40 inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="md:flex md:items-center md:justify-center bg-white rounded-2xl pt-12 pb-10 w-full md:w-[560px] md:h-[320px] mx-4 flex flex-col items-center relative">
                  <h2 className="text-lg font-semibold md:text-3xl md:font-semibold pb-2 text-center">
                    Create an account to continue
                  </h2>
                  <button
                    onClick={() => push("/petowners/register")}
                    className="rounded-full text-white bg-orange-500 md:py-4 md:text-lg my-7 md:my-8 py-3 text-lg w-52"
                  >
                    Create account
                  </button>
                  <div className="flex flex-row gap-1 justify-center text-base  text-gray-500 md:text-lg font-medium text-center pt-2">
                    Already have an account?
                    <a
                      onClick={() => push("/petowners/login")}
                      className="ml-1 underline text-base md:text-lg text-black font-semibold cursor-pointer"
                    >
                      Log in
                    </a>
                  </div>
                  <Image
                    src={closeIcon} // Use a correct relative path
                    alt="close button"
                    className="absolute right-5 top-5 cursor-pointer h-5 w-5 md:h-6 md:w-6"
                    onClick={() => setShowDialog(null)}
                  />
                </div>
              </div>
            )}

            {showDialog === "booking" && (
              <div className="fixed z-40 inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white shadow-lg md:h-[438px] md:w-[560px] md:rounded-2xl h-full w-full relative">
                  <div className="border-b-2 border-b-gray-200 md:h-[60px]">
                    <h2 className="ml-4 my-4 md:mt-6 md:ml-10 text-xl md:text-2xl font-bold mb-4 ">
                      Booking
                    </h2>
                  </div>
                  <div className="md:mt-10 md:mx-10">
                    <span className="ml-4 mr-2 mt-6 md:ml-3 md:mr-0 md:mb-6 flex text-base md:text-lg text-start text-gray-600">
                      Select date and time you want to schedule the service.
                    </span>
                    <DateAndTimePicker
                      label=""
                      value={formattedDate} // Ensure the value is a string in 'YYYY-MM-DD' format
                      onChange={handleDateChange} // Pass the function to update the selectedDate
                      error={!!errorDate} // Boolean value to indicate if there's an error
                      errorMsg={errorDate || undefined} // Pass the error message
                    />
                  </div>
                  <Image
                    src={closeIcon} // Use a correct relative path
                    alt="close button"
                    className="absolute right-5 top-5 cursor-pointer h-6 w-6"
                    onClick={() => setShowDialog(null)}
                  />
                  <div className="flex w-full absolute bottom-0">
                    <button className="text-base md:w-[480px] font-bold text-white absolute rounded-full bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center w-[343px] h-12 bg-orange-500">
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            )}
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

const PetSitterReview: React.FC<PetSitterReviewProps> = ({
  averageRating,
  totalReviews,
  reviews,
}) => {
  const [filteredReviews, setFilteredReviews] = useState(reviews);
  const [selectedRating, setSelectedRating] = useState<number | string>(
    "All Reviews"
  );
  const [page, setPage] = useState(1); // Track the current page
  const itemsPerPage = 5; // Number of reviews per page

  useEffect(() => {
    filterReviews();
    setPage(1);
  }, [selectedRating, reviews]);

  const filterReviews = () => {
    if (selectedRating === "All Reviews") {
      setFilteredReviews(reviews);
    } else {
      setFilteredReviews(
        reviews.filter((review) => review.rating === selectedRating)
      );
    }
  };

  const startIndex = (page - 1) * itemsPerPage;
  const currentReviews = filteredReviews.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Handle page change
  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const fallbackImage =
    "https://boeraqxraijbxhlrtdnn.supabase.co/storage/v1/object/public/image/pet-sitter-default-yellow.png";
  return (
    <div>
      <div className="md:rounded-tl-[120px]  md:rounded-tr-[16px]  flex bg-gray-100 md:mt-10">
        <div className="md:m-6 flex flex-col md:flex-row w-full h-[374px] md:h-[194px] m-4 bg-white rounded-tl-[99px] md:rounded-bl-[99px] rounded-tr-[12px] rounded-bl-[12px] rounded-br-[12px]">
          <div className="flex flex-col items-center justify-center mt-6 ml-6 md:mr-6 md:w-[20%]  w-[146px] h-[146px] bg-black rounded-tl-[99px] rounded-tr-[99px] rounded-bl-[99px]">
            <span className="text-white text-4xl font-bold leading-10">
              {(averageRating ?? 0).toFixed(1)}
            </span>
            <span className="text-white text-sm font-medium leading-6">
              {totalReviews} Reviews
            </span>
          </div>
          <div className="md:flex-col md:mt-6 md:mr-2 mt-2">
            <h4 className="text-xl font-bold ml-6 mt-4">Rating & Reviews</h4>

            <div className="items-center justify-start mx-6 space-y-2 cursor-pointer">
              {["All Reviews", 5, 4, 3, 2, 1].map((rating, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedRating(rating)}
                  className={`rating mr-2 h-8 items-center justify-center text-base border rounded-lg p-2 gap-[2px] ${
                    rating === selectedRating
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
                        className="mask mask-star-2 bg-green-500 w-5 h-5 pointer-events-none"
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
        {currentReviews.length === 0 ? (
          <div className="flex justify-center items-center flex-col bg-gray-100 p-4">
            <span className="text-gray-500 text-base">No reviews</span>
          </div>
        ) : (
          currentReviews.map((review, index) => (
            <div key={index} className="flex flex-col bg-gray-100 px-4">
              <div className="flex flex-row mb-4 md:mb-0 pt-6">
                <img
                  className="w-9 h-9 md:h-14 md:w-14 rounded-full mr-4 md:ml-4 object-cover"
                  src={review.image || fallbackImage}
                  alt={review?.full_name}
                />
                <div className="flex flex-col flex-grow md:flex-grow-0 md:w-[148px]">
                  <span className="text-lg font-medium">
                    {review.full_name}
                  </span>
                  <div className="text-sm font-medium text-gray-400">
                    {formatDate(review.created_at)}
                  </div>
                </div>
                <div className="flex rating h-8 text-base p-2 gap-[2px] md:ml-[65px]">
                  {[...Array(review.rating)].map((_, i) => (
                    <input
                      key={i}
                      type="radio"
                      name={`rating-${review.full_name}`}
                      className="mask mask-star-2 bg-green-500 w-3 h-3 md:w-5 md:h-5"
                      readOnly
                      disabled
                    />
                  ))}
                </div>
              </div>
              <div className="w-full md:flex md:justify-end border-b border-b-gray-200">
                <p className="pb-6 md:w-[60%] md:mr-4 text-justify text-sm font-medium text-gray-500 leading-6 ">
                  {review.review}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      <div className=" flex-col bg-gray-100 p-4 md:rounded-b-2xl"></div>
      {/* Pagination */}
      <div className="mb-10 md:mt-10 flex justify-center items-center">
        {filteredReviews.length > itemsPerPage && (
          <MuiPagination
            count={Math.ceil(filteredReviews.length / itemsPerPage)}
            page={page}
            onChange={handlePageChange}
            sx={{
              ".MuiPaginationItem-icon": {
                fontSize: "1.9rem", // Adjust the size as needed
              },
              ".MuiPaginationItem-root": {
                width: "40px", // Circle size
                height: "40px",
                fontSize: "16px",
                backgroundColor: "white",
                color: "#AEB1C3",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: 700,
                margin: "0 6px",

                "&.Mui-selected": {
                  backgroundColor: "#FFF1EC",
                  color: "#FF7037",
                },

                // Hover state
                "&:hover": {
                  backgroundColor: "white",
                  color: "#FF7037",
                },
                transition: "background-color 0.5s ease, color 0.5s ease",
              },
              ".MuiPaginationItem-previousNext": {
                backgroundColor: "transparent",
                "&:hover": {
                  backgroundColor: "transparent",
                },
                transition: "background-color 0.5s ease, color 0.5s ease",
              },
            }}
          />
        )}
      </div>
    </div>
  );
};
