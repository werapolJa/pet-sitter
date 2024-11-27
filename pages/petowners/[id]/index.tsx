import { useState } from "react";
import Sidebar from "@/components/pet-owner/Sidebar";
import BirthDatePicker from "@/components/pet-owner/BirthDatePicker";

const ProfileImage = ({
  profileImage,
  onImageChange,
}: {
  profileImage: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="relative rounded-full w-32 h-32 md:w-60 md:h-60 bg-gray-200 flex items-center justify-center mt-6">
    {/* If profile image exists, show the image, else show the default icon */}
    <img
      src={profileImage || "/images/profile-default-icon.svg"}
      alt="Profile"
      className={`object-cover w-full h-full rounded-full ${
        !profileImage ? "p-12 md:p-0 w-10 h-10 md:w-20 md:h-20 opacity-80" : ""
      }`}
    />
    <button
      className="absolute bottom-1 right-1 md:bottom-1 md:right-1 bg-orange-100 text-white rounded-full p-2 md:p-4 md:w-15 md:h-15"
      onClick={() => document.getElementById("file-upload")?.click()}
    >
      <img className="md:w-4 md:h-4" src="/images/plus-icon.svg" />
    </button>
    <input
      type="file"
      id="file-upload"
      className="hidden"
      accept="image/*"
      onChange={onImageChange}
    />
  </div>
);

const FormInputSection = () => (
  <div className="mt-6">
    <form>
      <div className="mb-1 md:mb-10 gap-1">
        <label className="block text-base font-medium mb-2">Your Name*</label>
        <input
          type="text"
          className="input input-bordered w-full rounded-lg border-gray-200 focus:ring-orange-500 focus:border-orange-500"
          placeholder="Your Name"
        />
      </div>

      <div className="md:mb-10 flex flex-col md:flex-row md:space-x-4 md:space-y-0 gap-1">
        <div className="w-full md:w-1/2 ">
          <label className="block text-base font-medium mb-2">Email*</label>
          <input
            type="email"
            className="input input-bordered w-full rounded-lg border-gray-200 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Email"
          />
        </div>
        <div className="md:mb-10 w-full md:w-1/2">
          <label className="block text-base font-medium mb-2">Phone*</label>
          <input
            type="tel"
            className="input input-bordered w-full rounded-lg border-gray-200 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Phone"
          />
        </div>
      </div>

      <div className="md:mb-10 flex flex-col md:flex-row md:space-x-4 md:space-y-0 gap-1">
        <div className="w-full md:w-1/2">
          <label className="block text-base font-medium mb-2">ID Number</label>
          <input
            type="text"
            className="input input-bordered w-full rounded-lg border-gray-200 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Your ID number"
          />
        </div>
        <div className="w-full md:w-1/2 relative">
          <label className="block text-base font-medium mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            className="input input-bordered w-full rounded-lg border-gray-200 focus:ring-orange-500 focus:border-orange-500"
          />
          <span className="absolute top-3 right-3 text-gray-500"></span>
        </div>
      </div>

      <div className="flex justify-end mt-6 gap-1">
        <button className="py-3 px-6 rounded-3xl text-base font-bold text-white bg-orange-500">
          Update Profile
        </button>
      </div>
    </form>
  </div>
);

const ProfilePage = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full md:bg-custom-gray flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      {/* Mobile */}
      <div className="flex flex-col w-full h-[752px] py-6 px-4 md:hidden">
        <span className="text-xl font-bold text-black">Profile</span>
        <ProfileImage
          profileImage={profileImage}
          onImageChange={handleImageUpload}
        />
        <FormInputSection />
      </div>

      {/* Desktop */}
      <div className="w-[956px] h-[888px] ml-10 my-10 md:ml-20 p-10 bg-white rounded-2xl hidden md:block">
        <span className="text-2xl font-bold text-black">Profile</span>
        <ProfileImage
          profileImage={profileImage}
          onImageChange={handleImageUpload}
        />
        <FormInputSection />
      </div>
    </div>
  );
};

export default ProfilePage;
