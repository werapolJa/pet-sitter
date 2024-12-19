import React from "react";
import Image from "next/image";
import { useUserData } from "@/context/adminpetowner";

export const ReviewsTab: React.FC = () => {
  const { userData } = useUserData();

  if (!userData) return null;

  return (
    <div className="p-6 bg-white rounded-b-lg rounded-tr-lg pt-10">
      {userData.reviews && userData.reviews.length > 0 ? (
        userData.reviews.map((review, index) => (
          <div key={index} className="mb-6 border-b pb-4 flex gap-10">
            <div className="flex items-center mb-2 ml-8 gap-3">
              <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 relative">
                <Image
                  src={
                    review.petsitter_image || "https://via.placeholder.com/104"
                  }
                  alt="Pet"
                  layout="fill"
                  objectFit="cover"
                  objectPosition="center"
                />
              </div>
              <div>
                <p className="w-36 text-lg font-medium text-black">
                  {review.petsitter_name}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(review.review_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="rating">
                {Array.from({ length: 5 }, (_, i) => (
                  <input
                    key={i}
                    type="radio"
                    name={`rating-${index}`}
                    className="mask mask-star-2 bg-green-500 w-5 h-5"
                    checked={i + 1 == review.rating}
                    readOnly
                  />
                ))}
              </div>
              <p className="text-base text-gray-500">{review.review_message}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-base text-gray-500">
          No reviews found for this user.
        </p>
      )}
    </div>
  );
};
