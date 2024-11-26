import logoBack from "@/public/images/logoBlack.svg";
import iconBell from "@/public/images/iconBell.svg";
import iconMessage from "@/public/images/iconMessage.svg";
import iconHamburger from "@/public/images/iconHamburger.svg";
import Image from "next/image";

export default function Header() {
  return (
    <nav className="flex items-center justify-between py-3 px-5 bg-white text-black border-b md:px-12">
      {/* Logo */}
      <button className="w-20 md:w-32">
        <Image src={logoBack} alt="Logo" />
      </button>

      {/* Icons for Mobile */}
      <div className="flex justify-between w-32 md:hidden">
        <button>
          <Image src={iconBell} alt="iconBell" />
        </button>
        <button>
          <Image src={iconMessage} alt="iconMessage" />
        </button>
        <button>
          <Image src={iconHamburger} alt="iconHamburger" />
        </button>
      </div>

      {/* Icons for Medium and Larger */}
      <div className="hidden md:flex justify-between w-[500px]">
        <button>
          <h1 className="font-bold">Become a Pet Sitter</h1>
        </button>
        <button>
          <h1 className="font-bold">Login</h1>
        </button>
        <button className="bg-orange-500 w-36 h-12 rounded-full">
          <h1 className="text-white font-bold">Find A Pet Sitter</h1>
        </button>
      </div>
    </nav>
  );
}
