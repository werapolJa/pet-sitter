import React, {
  useEffect,
  useState,
  ChangeEvent,
  FormEvent,
  useCallback,
} from "react";
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
import IdCardInput from "@/components/pet-owner/IdCardInput";
import PhoneInput from "@/components/pet-owner/PhoneInput";
import SkeletonLoader from "@/components/pet-owner/SkeletonLoader";
import CustomAlert from "@/components/pet-owner/CustomAlert";
import withAuth from "@/utils/withAuth";
import { useAuth } from "@/context/authentication";

const EditProfileForm = ({ inputimage }: { inputimage: string | null }) => {
  const { user } = useAuth();
  const router = useRouter();
  const { userid } = router.query;
  console.log(userid);
  console.log("1");

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

  const [messageErrorName, setMessageErrorName] = useState<string>("");
  const [messageErrorEmail, setMessageErrorEmail] = useState<string>("");
  const [messageErrorPhone, setMessageErrorPhone] = useState<string>("");
  const [messageErrorIdNumber, setMessageErrorIdNumber] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");

  const getProfile = useCallback(async () => {
    if (userid !== user?.sub) {
      router.push("/");
    }

    if (!userid) return;
    console.log("Fetching user data...");

    try {
      const response = await axios.get(`/api/petowners/userprofile/${userid}`);

      const data = response.data.data;
      setName(data.full_name);
      setEmail(data.email);
      setPhone(data.phone);
      setIdNumber(data.id_number);
      setBirthDate(data.birthdate);
      setLoading(false);
      console.log("Fetched user data:", data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to load user data");
      setLoading(false);
    }
  }, [userid]);

  useEffect(() => {
    getProfile();
  }, [userid, getProfile]);

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

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    setPhoneError(false);
    setMessageErrorPhone("");
  };

  const handleIdNumberChange = (value: string) => {
    setIdNumber(value);
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
    if (!userid) return;
    try {
      const updatedData = {
        full_name: name,
        email: email,
        phone: phone,
        image: inputimage,
        id_number: idNumber || null,
        birthdate: birthDate || null,
      };

      // Sending the PUT request
      const response = await axios.put(
        `/api/petowners/userprofile/${userid}`,
        updatedData
      );

      // Logging the response data and alerting success
      console.log("Profile updated successfully:", response.data);
      setAlertSeverity("success");
      setAlertMessage("Profile updated successfully!");
      setOpenAlert(true);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data?.error);
        if (error.response?.data?.error.includes("name")) {
          setNameError(true);
          setMessageErrorName(`${error.response?.data?.error}`);
        }
        if (error.response?.data?.error.includes("email")) {
          setEmailError(true);
          setMessageErrorEmail(`${error.response?.data?.error}`);
        }
        if (error.response?.data?.error.includes("phone")) {
          setPhoneError(true);
          setMessageErrorPhone(`${error.response?.data?.error}`);
        }
        if (error.response?.data?.error.includes("ID")) {
          setIdNumberError(true);
          setMessageErrorIdNumber(`${error.response?.data?.error}`);
        }
      }
    }
  };

  if (loading) {
    return <SkeletonLoader />; // Or use a spinner
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
            <PhoneInput
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
            <IdCardInput
              label="ID Number"
              type="text"
              value={idNumber}
              onChange={handleIdNumberChange}
              placeholder="Your ID number"
              error={idNumberError}
              errorMsg={messageErrorIdNumber}
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
      <CustomAlert
        open={openAlert}
        message={alertMessage}
        severity={alertSeverity}
        onClose={() => setOpenAlert(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        size="medium"
      />
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
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { userid } = router.query;

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await axios.get(
          `/api/petowners/userprofile/${userid}`
        );
        const profileImage = response.data.data?.image || null;
        setImage(profileImage);
      } catch (err) {
        console.log("Error fetching profile image:", err);
      }
    };

    if (userid) {
      fetchProfileImage();
    }
  }, [userid]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      alert("No file selected.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }

    setLoading(true);

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImage(response.data.urls[0]);
    } catch (err) {
      console.log("Error uploading image:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="w-full md:bg-custom-gray flex flex-col md:flex-row min-h-screen">
        <Sidebar />
        <div className="flex flex-col w-full py-6 px-4 md:hidden">
          <span className="text-xl font-bold text-black">Profile</span>
          {loading ? (
            <div className="loading loading-dots loading-lg"></div>
          ) : (
            <ProfileImage image={image} onImageChange={handleImageUpload} />
          )}
          <EditProfileForm inputimage={image} />
        </div>

        <div className="w-full h-[888px] ml-10 my-10 md:ml-8 md:mr-20 md:mt-10 md:mb-20 p-10 bg-white rounded-2xl hidden md:flex md:flex-col">
          <span className="text-2xl font-bold text-black">Profile</span>
          {loading ? (
            <div className="loading loading-dots loading-lg"></div>
          ) : (
            <ProfileImage image={image} onImageChange={handleImageUpload} />
          )}
          <EditProfileForm inputimage={image} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default withAuth(ProfilePage);
