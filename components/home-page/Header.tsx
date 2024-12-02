import logoback from "@/public/assets/landing-page/logoblack.svg";
import iconbell from "@/public/assets/landing-page/iconbell.svg";
import iconmessage from "@/public/assets/landing-page/iconmessage.svg";
import iconhamburger from "@/public/assets/landing-page/iconhamburger.svg";
import { useAuth } from "@/context/authentication";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const { isAuthenticated , logout} = useAuth();
  console.log(isAuthenticated);
  return (
    <nav className="flex items-center justify-between py-3 px-5 bg-white text-black border-b md:px-12">
      {/* Logo */}
      <button className="w-20 md:w-32">
        <Image src={logoback} alt="Logo" />
      </button>
      {/* Icons for Mobile */}
      <div className="flex justify-between w-32 md:hidden">
        <button>
          <Image src={iconbell} alt="iconbell" />
        </button>
        <button>
          <Image src={iconmessage} alt="iconmessage" />
        </button>
        <button>
          <Image src={iconhamburger} alt="iconhamburger" />
        </button>
      </div>

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
              <div tabIndex={0} role="button" className=" w-12 rounded-full">
                <img
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  className="rounded-full"
                />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
              >
                <li>
                  <a>Profile</a>
                </li>
                <li>
                  <a>Your Pet</a>
                </li>
                <li>
                  <a>History</a>
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
