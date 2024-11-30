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
import { useAuth } from "@/context/authentication";

const EditProfileForm = () => {
  const router = useRouter();
  const { userid } = router.query;
  const { login, user, logout, isAuthenticated } = useAuth();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [idNumber, setIdNumber] = useState<string>("");
  const [birthDate, setBirthDate] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null); // Added image state

  const [nameError, setNameError] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [phoneError, setPhoneError] = useState<boolean>(false);
  const [idNumberError, setIdNumberError] = useState<boolean>(false);
  const [birthDateError, setBirthDateError] = useState<boolean>(false);

  const [messageErrorName, setMessageErrorName] = useState<string>("");
  const [messageErrorEmail, setMessageErrorEmail] = useState<string>("");
  const [messageErrorPhone, setMessageErrorPhone] = useState<string>("");
  const [messageErrorIdNumber, setMessageErrorIdNumber] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!login) {
      router.push("petowners/login"); // Redirect to login if not logged in
    } else {
      const fetchProfile = async () => {
        setLoading(true); // Start loading
        try {
          await getProfile(); // Fetch profile only if logged in
        } catch (error) {
          console.error("Error fetching profile:", error);
        } finally {
          setLoading(false); // Stop loading after fetching is done
        }
      };

      fetchProfile(); // Fetch profile if logged in
    }
  }, [login, router]);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setNameError(false);
    setMessageErrorName("");
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

    if (!name) {
      setNameError(true);
      setMessageErrorName("Name is required.");
      hasError = true;
    } else if (name.length < 6 || name.length > 20) {
      setNameError(true);
      setMessageErrorName("Name must be between 6 and 20 characters.");
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
    }

    // Phone validation
    if (!phone) {
      setPhoneError(true);
      setMessageErrorPhone("Phone number is required.");
      hasError = true;
    } else if (!/^[0]\d{9}$/.test(phone)) {
      setPhoneError(true);
      setMessageErrorPhone(
        "Phone number must start with 0 and have 10 digits."
      );
      hasError = true;
    } else {
      setPhoneError(false); // Reset phone error if valid
    }

    // ID Number validation
    if (idNumber && !/^\d{13}$/.test(idNumber)) {
      setIdNumberError(true);
      setMessageErrorIdNumber("ID Number must be 13 digits.");
      hasError = true;
    } else if (idNumber) {
      setIdNumberError(false); // Reset ID number error if valid
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
    editProfile();
  };

  const editProfile = async () => {
    if (!isAuthenticated || !userid) return;
    try {
      const updatedData = {
        full_name: name,
        email: email,
        phone: phone,
        image: image || null,
        id_number: idNumber || null,
        birthdate: birthDate || null,
      };

      // Sending the PUT request
      const response = await axios.put(
        `http://localhost:3000/api/petowners/userprofile/${userid}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Logging the response data and alerting success
      console.log("Profile updated successfully:", response.data);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
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

  const getProfile = async () => {
    if (!isAuthenticated || !userid) return;
    console.log("Fetching user data...");

    try {
      const response = await axios.get(
        `http://localhost:3000/api/petowners/userprofile/${userid}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = response.data.data;
      setName(data.full_name);
      setEmail(data.email);
      setPhone(data.phone);
      setIdNumber(data.id_number);
      setBirthDate(data.birthdate);
      setImage(data.image);
      setLoading(false);
      console.log("Fetched user data:", data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to load user data");
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Or use a spinner
  }

  if (error) {
    return <div>{error}</div>; // Display the error message if something goes wrong
  }

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
            errorMsg={messageErrorName}
          />
        </div>

        <div className="mb-6 flex flex-col md:flex-row md:space-x-10">
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

        <div className="mb-6 flex flex-col md:flex-row md:space-x-10">
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
            className="mt-8 w-[159px] h-[48px] flex items-center justify-center rounded-3xl text-base font-bold text-white bg-orange-500"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

const ProfileImage = ({
  image,
  onImageChange,
}: {
  image: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="relative rounded-full w-32 h-32 md:w-60 md:h-60 bg-gray-200 flex items-center justify-center mt-6">
    <Image
      src={image || profileDefaultIcon}
      alt="Profile"
      width={240}
      height={240}
      className={`object-cover w-full h-full rounded-full ${
        !image ? "p-12 md:p-0 w-10 h-10 md:w-20 md:h-20 opacity-80" : ""
      }`}
    />
    <button
      className="absolute bottom-1 right-1 md:bottom-1 md:right-1 bg-orange-100 text-white rounded-full p-2 md:p-4 md:w-15 md:h-15"
      onClick={() => document.getElementById("file-upload")?.click()}
    >
      <Image
        className="md:w-4 md:h-4"
        src={plusIcon}
        alt="Add"
        width={16}
        height={16}
      />
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

const ProfilePage = () => {
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
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
          <ProfileImage image={image} onImageChange={handleImageUpload} />
          <EditProfileForm />
        </div>

        <div className="w-full h-[888px] ml-10 my-10 md:ml-8 md:mr-20 md:mt-10 md:mb-20 p-10 bg-white rounded-2xl hidden md:block">
          <span className="text-2xl font-bold text-black">Profile</span>
          <ProfileImage image={image} onImageChange={handleImageUpload} />
          <EditProfileForm />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
