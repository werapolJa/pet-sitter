import React from "react";

interface SkeletonLoaderProps {
  ariaLabel?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  ariaLabel = "Loading profile",
}) => {
  return (
    <div
      className="mt-6 animate-pulse"
      role="status"
      aria-busy="true"
      aria-label={ariaLabel}
    >
      {/* Form Skeleton */}
      <div className="mb-6">
        {/* Skeleton for "Your Name" Input */}
        <div className="h-6 bg-gray-200 rounded-md dark:bg-gray-700 w-2/6 md:w-[200px] mb-2"></div>
        <div className="h-10 bg-gray-200 rounded-md dark:bg-gray-700 w-full"></div>
      </div>

      {/* Skeleton for Email and Phone Inputs */}
      <div className="mb-6 flex flex-col md:flex-row md:space-x-10">
        <div className="w-full md:w-1/2 mb-6 md:mb-0">
          <div className="h-6 bg-gray-200 rounded-md dark:bg-gray-700 w-2/6 md:w-[200px] mb-2"></div>
          <div className="h-10 bg-gray-200 rounded-md dark:bg-gray-700 w-full"></div>
        </div>
        <div className="w-full md:w-1/2">
          <div className="h-6 bg-gray-200 rounded-md dark:bg-gray-700 w-2/6 md:w-[200px] mb-2"></div>
          <div className="h-10 bg-gray-200 rounded-md dark:bg-gray-700 w-full"></div>
        </div>
      </div>

      {/* Skeleton for ID Number and Date of Birth Inputs */}
      <div className="mb-6 flex flex-col md:flex-row md:space-x-10">
        <div className="w-full md:w-1/2 mb-6 md:mb-0">
          <div className="h-6 bg-gray-200 rounded-md dark:bg-gray-700 w-2/6 md:w-[200px] mb-2"></div>
          <div className="h-10 bg-gray-200 rounded-md dark:bg-gray-700 w-full"></div>
        </div>
        <div className="w-full md:w-1/2">
          <div className="h-6 bg-gray-200 rounded-md dark:bg-gray-700 w-2/6 md:w-[200px] mb-2"></div>
          <div className="h-10 bg-gray-200 rounded-md dark:bg-gray-700 w-full"></div>
        </div>
      </div>

      {/* Skeleton for Submit Button */}
      <div className="flex justify-end md:mt-12 md:mb-10">
        <div className="w-[159px] h-[48px] bg-gray-200 rounded-3xl dark:bg-gray-700"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
