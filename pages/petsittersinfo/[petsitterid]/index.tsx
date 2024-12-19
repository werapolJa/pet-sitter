import React from "react";
import Header from "@/components/home-page/Header";
import Footer from "@/components/home-page/Footer";
import PetSitterInfoPage from "@/components/pet-sitter-info/PetSitterInfoPage";

export default function YourPet() {
  return (
    <div>
      <Header />
      <PetSitterInfoPage />
      <Footer />
    </div>
  );
}
