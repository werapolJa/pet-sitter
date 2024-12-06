import logoback from "@/public/assets/landing-page/logoblack.svg";
import iconbell from "@/public/assets/landing-page/iconbell.svg";
import iconmessage from "@/public/assets/landing-page/iconmessage.svg";
import iconhamburger from "@/public/assets/landing-page/iconhamburger.svg";
import profiledefault from "@/public/assets/profile-default-icon.svg";
import { useAuth } from "@/context/authentication";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const { isAuthenticated, logout, user } = useAuth();
  const [profile, setProfile] = useState<{ image?: string }>({});
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (user) {
      getDataProfile();
    }
  }, [user?.sub]);

  async function getDataProfile() {
    try {
      const res = await axios.get(`/api/petowners/userprofile/${user?.sub}`);
      setProfile(res.data.data);
    } catch (error) {
      console.log("Error occurred:", error);
    }
  }

  return (
    <nav  className={`flex items-center justify-between py-3 px-5 bg-white text-black border-b md:px-12 w-full ${isOpen ? " fixed z-50" : ""}`}>
      {/* Logo */}
      <Link href="/">
      <button className="w-20 md:w-32">
        <Image src={logoback} alt="Logo" />
      </button>
      </Link>
      {/* Icons for Mobile */}
      {isAuthenticated ? (
        <>
          <div className="flex justify-between w-32 md:hidden">
            <button>
              <Image src={iconbell} alt="iconbell" />
            </button>
            <button>
              <Image src={iconmessage} alt="iconmessage" />
            </button>
            <div className="relative">
              {/* Hamburger Icon */}
              <button onClick={toggleDropdown} className="p-2">
                <Image src={iconhamburger} alt="iconhamburger" />
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <ul className="fixed left-0 w-screen h-screen mt-2  bg-white shadow-lg rounded-lg p-4 z-50 space-y-4">
                  <Link href={`/petowners/${user?.sub}`}>
                    <li className="mb-2">
                      <p className="text-black hover:bg-gray-200">
                        Profile
                      </p>
                    </li>
                  </Link>
                  <li className="mb-2">
                    <p className="text-black hover:bg-gray-200">Your Pet</p>
                  </li>
                  <li className="mb-2">
                    <p className="text-black hover:bg-gray-200">
                      Booking History
                    </p>
                  </li>
                  <hr />
                  <li className="mb-2 text-black hover:bg-gray-200">
                    <p onClick={() => logout()}>Log out</p>
                  </li>
                  <Link href="/search">
                    <li className="py-4">
                      <p className="block w-full text-center bg-orange-500 text-white py-3 rounded-full hover:bg-orange-600 ">
                        Find A Pet Sitter
                      </p>
                    </li>
                  </Link>
                </ul>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between w-32 md:hidden ">
            <button>
              <Image src={iconbell} alt="iconbell" />
            </button>
            <button>
              <Image src={iconmessage} alt="iconmessage" />
            </button>
            <div className="relative">
              {/* Hamburger Icon */}
              <button onClick={toggleDropdown} className="p-2">
                <Image src={iconhamburger} alt="iconhamburger" />
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <ul className="fixed left-0 w-screen h-screen mt-2  bg-white shadow-lg rounded-lg p-4 z-50 ">
                  <li className="mb-2 py-2">
                    <p className="text-black hover:bg-gray-200">
                      Become a Pet Sitter
                    </p>
                  </li>
                  <Link href="/petowners/login">
                    <li className="mb-2 py-2">
                      <p className="text-black hover:bg-gray-200">Login</p>
                    </li>
                  </Link>
                  <Link href="/search">
                    <li>
                      <p className="block w-full text-center bg-orange-500 text-white py-2 rounded-full hover:bg-orange-600">
                        Find A Pet Sitter
                      </p>
                    </li>
                  </Link>
                </ul>
              )}
            </div>
          </div>
        </>
      )}

      {/* Icons for Medium and Larger */}
      {isAuthenticated ? (
        <div className="md:flex justify-between w-auto gap-x-9 hidden">
          <div className="md:flex md:justify-center md:items-center gap-x-3">
            <button className="w-12 h-12 rounded-full bg-gray-100 md:flex md:justify-center md:items-center">
              <Image src={iconbell} alt="iconbell" />
            </button>
            <button className="w-12 h-12 rounded-full bg-gray-100 md:flex md:justify-center md:items-center">
              <Image src={iconmessage} alt="iconmessage" />
            </button>
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className=" rounded-full">
                {profile.image ? (
                  <Image
                    src={profile.image}
                    alt="profile"
                    width={20}
                    height={20}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <Image
                    src={profiledefault}
                    alt="profile"
                    width={20}
                    height={20}
                    className="w-12 h-12 rounded-full bg-gray-100 md:flex md:justify-center md:items-center"
                  />
                )}
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
              >
                <Link href={`/petowners/${user?.sub}`}>
                  <li>
                    <a>Profile</a>
                  </li>
                </Link>
                <li>
                  <a>Your Pet</a>
                </li>
                <li>
                  <a>Booking History</a>
                </li>
                <hr />
                <li>
                  <a onClick={() => logout()}>Log out</a>
                </li>
              </ul>
            </div>
          </div>
          <Link href="/search">
            <button className="bg-orange-500 w-auto h-12 rounded-full">
              <h1 className="text-white font-bold mx-6 my-3">
                Find A Pet Sitter
              </h1>
            </button>
          </Link>
        </div>
      ) : (
        <div className="hidden md:flex justify-between w-[500px]">
          <button>
            <h1 className="font-bold">Become a Pet Sitter</h1>
          </button>
          <Link
            href="/petowners/login"
            className="md:flex md:justify-center md:items-center"
          >
            <button>
              <h1 className="font-bold">Login</h1>
            </button>
          </Link>
          <Link href="/search">
            <button className="bg-orange-500 w-36 h-12 rounded-full">
              <h1 className="text-white font-bold">Find A Pet Sitter</h1>
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
}
