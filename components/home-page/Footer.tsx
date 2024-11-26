import logowhite from "@/public/images/logoWhite.svg";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-black w-full flex flex-col justify-center items-center py-6">
      <div>
        <Image src={logowhite} alt="Logo White" />
      </div>
      <h1 className="text-white text-lg mt-4">
        Find your perfect pet sitter with us.
      </h1>
    </footer>
  );
}
