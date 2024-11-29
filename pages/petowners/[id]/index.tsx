import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import axios from "axios";
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
  const [messageErrorPhone, setMessageErrorPhone] = useState<string>("");
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
    setMessageErrorPhone("");
  };

  const handleIdNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIdNumber(e.target.value);
    setIdNumberError(false);
    setMessageErrorIdNumber("");
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

    let hasError = false;

    if (!name || name.length < 6 || name.length > 20) {
      setNameError(true);
      hasError = true;
    } else {
      setNameError(false); // Reset error if name is valid
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
      setEmailError(false); // Reset email error if valid
      // Check if email is unique using axios
      try {
        const { data } = await axios.get(`/api/checkemail`, {
          params: { email },
        });

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

    // Phone validation
    if (!phone) {
      setPhoneError(true);
      setMessageErrorPhone("Phone number is required.");
      hasError = true;
    } else if (!/^\d{10}$/.test(phone)) {
      setPhoneError(true);
      setMessageErrorPhone("Phone number must be 10 digits.");
      hasError = true;
    } else {
      setPhoneError(false); // Reset phone error if valid
      // Check if phone number is unique using axios
      try {
        const { data } = await axios.get(`/api/checkphone`, {
          params: { phone },
        });

        if (data.exists) {
          setPhoneError(true);
          setMessageErrorPhone("Phone number already exists.");
          hasError = true;
        }
      } catch (error) {
        console.error("Error checking phone number:", error);
        setPhoneError(true);
        setMessageErrorPhone("Error checking phone number uniqueness.");
        hasError = true;
      }
    }

    // ID Number validation
    if (idNumber && !/^\d{13}$/.test(idNumber)) {
      setIdNumberError(true);
      setMessageErrorIdNumber("ID Number must be 13 digits.");
      hasError = true;
    } else if (idNumber) {
      setIdNumberError(false); // Reset ID number error if valid
      // Check if ID number is unique using axios
      try {
        const { data } = await axios.get(`/api/checkidnumber`, {
          params: { idNumber },
        });

        if (data.exists) {
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

    // Birth Date validation
    if (birthDate) {
      const selectedDate = new Date(birthDate);
      const currentDate = new Date();
      if (selectedDate > currentDate) {
        setBirthDateError(true);
        hasError = true;
      } else {
        setBirthDateError(false); // Reset birth date error if valid
      }
    }

    if (hasError) return;

    const updatedData = { name, email, phone, idNumber, birthDate };

    try {
      // Send updated profile data to the server using axios
      await axios.put(`/api/petowners/updateprofile`, updatedData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Attach token to the header
        },
      });
      // Handle success, maybe redirect or show success message
    } catch (error) {
      console.error("Error updating profile:", error);
    }

    // Reset error states
    setNameError(false);
    setEmailError(false);
    setPhoneError(false);
    setIdNumberError(false);
    setBirthDateError(false);
    setMessageErrorEmail("");
    setMessageErrorPhone("");
    setMessageErrorIdNumber("");
  };

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/petowners/${id}/userprofile`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Attach token to the header
            },
          }
        );

        const data = response.data; // axios already parses the response into JSON
        // Update the state with the user data
        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone);
        setIdNumber(data.idNumber);
        setBirthDate(data.birthDate);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    fetchUserData(); // Call the function to fetch user data
  }, [id]); // Make sure the effect runs again if id changes

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
            errorMsg="Name is required"
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
              errorMsg={messageErrorEmail}
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
              errorMsg={messageErrorPhone}
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
              errorMsg={messageErrorIdNumber}
              maxLength={13}
              pattern="\d*"
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
