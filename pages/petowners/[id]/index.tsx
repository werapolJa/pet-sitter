import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import profileDefaultIcon from "@/public/assets/profile-default-icon.svg";
import plusIcon from "@/public/assets/plus-icon.svg";
import Header from "@/components/home-page/Header";
import Footer from "@/components/home-page/Footer";
import Sidebar from "@/components/pet-owner/Sidebar";
import Input from "@/components/pet-owner/Input";
import DatePickerComponent from "@/components/pet-owner/DatePickerComponent";

const ProfileImage = ({
  profileImage,
  onImageChange,
}: {
  profileImage: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="relative rounded-full w-32 h-32 md:w-60 md:h-60 bg-gray-200 flex items-center justify-center mt-6">
    <Image
      src={profileImage || profileDefaultIcon}
      alt="Profile"
      className={`object-cover w-full h-full rounded-full ${
        !profileImage ? "p-12 md:p-0 w-10 h-10 md:w-20 md:h-20 opacity-80" : ""
      }`}
    />
    <button
      className="absolute bottom-1 right-1 md:bottom-1 md:right-1 bg-orange-100 text-white rounded-full p-2 md:p-4 md:w-15 md:h-15"
      onClick={() => document.getElementById("file-upload")?.click()}
    >
      <Image className="md:w-4 md:h-4" src={plusIcon} alt="Add" />
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

const FormInputSection = () => {
  const router = useRouter();
  const { id } = router.query;

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [idNumber, setIdNumber] = useState<string>("");
  const [birthDate, setBirthDate] = useState<string | null>(null);

  const [nameError, setNameError] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [phoneError, setPhoneError] = useState<boolean>(false);
  const [idNumberError, setIdNumberError] = useState<boolean>(false);
  const [birthDateError, setBirthDateError] = useState<boolean>(false);

  const [messageErrorEmail, setMessageErrorEmail] = useState<string>("");
  const [messageErrorIdNumber, setMessageErrorIdNumber] = useState<string>("");

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setNameError(false);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError(false);
    setMessageErrorEmail("");
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
    setPhoneError(false);
  };

  const handleIdNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIdNumber(e.target.value);
    setIdNumberError(false);
  };

  const handleBirthDateChange = (date: string | null) => {
    if (date) {
      const currentDate = new Date();
      const selectedDate = new Date(date);

      if (selectedDate > currentDate) {
        setBirthDateError(true);
        setBirthDate(""); // Optionally clear the date
      } else {
        setBirthDate(date);
        setBirthDateError(false);
      }
    } else {
      setBirthDate(null); // Clear the date
      setBirthDateError(false); // Reset the error
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (token) {
      const updatedData = { name, email, phone, idNumber, birthDate };
      try {
        const response = await fetch(`/api/update-profile`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Attach token to the header
          },
          body: JSON.stringify(updatedData),
        });
        const result = await response.json();
        if (result.success) {
          // Handle success, maybe redirect or show success message
        } else {
          // Handle error (e.g., show error message)
        }
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }

    // Reset error states
    setNameError(false);
    setEmailError(false);
    setPhoneError(false);
    setIdNumberError(false);
    setBirthDateError(false);

    let hasError = false;

    if (!name || name.length < 6 || name.length > 20) {
      setNameError(true);
      hasError = true;
    }

    if (!email) {
      setEmailError(true);
      setMessageErrorEmail("Email is required.");
      hasError = true;
    } else if (!email.includes("@") || !email.endsWith(".com")) {
      setEmailError(true);
      setMessageErrorEmail(
        "Email must be in a valid format (e.g., example@domain.com)."
      );
      hasError = true;
    } else {
      // Check if email is unique (this needs to be done through an API call)
      try {
        const response = await fetch(`/api/check-email?email=${email}`);
        const data = await response.json();

        if (data.exists) {
          setEmailError(true);
          setMessageErrorEmail("Email already exists.");
          hasError = true;
        }
      } catch (error) {
        console.error("Error checking email:", error);
        setEmailError(true);
        setMessageErrorEmail("Error checking email uniqueness.");
        hasError = true;
      }
    }

    if (!phone) {
      setPhoneError(true);
      hasError = true;
    } else {
      try {
        const phoneResponse = await fetch(`/api/check-phone?phone=${phone}`);
        const phoneData = await phoneResponse.json();
        if (phoneData.exists) {
          setPhoneError(true);
          hasError = true;
        }
      } catch (error) {
        console.error("Error checking phone number:", error);
        setPhoneError(true);
        hasError = true;
      }
    }

    if (idNumber && !/^\d{13}$/.test(idNumber)) {
      setIdNumberError(true);
      setMessageErrorIdNumber("ID Number must be 13 digits.");
      hasError = true;
    } else if (idNumber) {
      try {
        const idResponse = await fetch(
          `/api/check-id-number?idNumber=${idNumber}`
        );
        const idData = await idResponse.json();
        if (idData.exists) {
          setIdNumberError(true);
          setMessageErrorIdNumber("ID Number already exists.");
          hasError = true;
        }
      } catch (error) {
        console.error("Error checking ID number:", error);
        setIdNumberError(true);
        setMessageErrorIdNumber("Error checking ID number uniqueness.");
        hasError = true;
      }
    }

    // Validate Birth Date (only if filled)
    if (birthDate) {
      const selectedDate = new Date(birthDate);
      const currentDate = new Date();
      if (selectedDate > currentDate) {
        setBirthDateError(true);
        hasError = true;
      }
    }

    if (hasError) return;
  };

  useEffect(() => {
    const token = localStorage.getItem("token"); // or from cookies
    if (!token) {
      router.push("/petowners/login"); // Redirect to login if no token
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/user-profile`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Attach token to the header
            },
          });
          const data = await response.json();
          // Update the state with the user data
          setName(data.name);
          setEmail(data.email);
          setPhone(data.phone);
          setIdNumber(data.idNumber);
          setBirthDate(data.birthDate);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchData();
    }
  }, []);

  return (
    <div className="mt-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <Input
            label="Your Name*"
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Your Name"
            error={nameError}
          />
        </div>

        <div className="mb-6 flex flex-col md:flex-row md:space-x-4">
          <div className="w-full md:w-1/2 mb-6 md:mb-0">
            <Input
              label="Email*"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Email"
              error={emailError}
              erroremailMsg={messageErrorEmail}
            />
          </div>

          <div className="w-full md:w-1/2">
            <Input
              label="Phone*"
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="Phone"
              error={phoneError}
            />
          </div>
        </div>

        <div className="mb-6 flex flex-col md:flex-row md:space-x-4">
          <div className="w-full md:w-1/2 mb-6 md:mb-0">
            <Input
              label="ID Number"
              type="text"
              value={idNumber}
              onChange={handleIdNumberChange}
              placeholder="Your ID number"
              error={idNumberError}
            />
          </div>

          <div className="w-full md:w-1/2">
            <DatePickerComponent
              label="Date of Birth"
              value={birthDate}
              onChange={handleBirthDateChange}
              error={birthDateError}
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="w-[159px] h-[48px] flex items-center justify-center rounded-3xl text-base font-bold text-white bg-orange-500"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

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
    <div>
      <Header />
      <div className="w-full md:bg-custom-gray flex flex-col md:flex-row min-h-screen">
        <Sidebar />
        <div className="flex flex-col w-full py-6 px-4 md:hidden">
          <span className="text-xl font-bold text-black">Profile</span>
          <ProfileImage
            profileImage={profileImage}
            onImageChange={handleImageUpload}
          />
          <FormInputSection />
        </div>

        <div className="w-[956px] h-[888px] ml-10 my-10 md:ml-20 p-10 bg-white rounded-2xl hidden md:block">
          <span className="text-2xl font-bold text-black">Profile</span>
          <ProfileImage
            profileImage={profileImage}
            onImageChange={handleImageUpload}
          />
          <FormInputSection />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
