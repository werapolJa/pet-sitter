import React from "react";
import Header from "@/components/home-page/Header";
import Footer from "@/components/home-page/Footer";
import Sidebar from "@/components/pet-owner/Sidebar";

export default function Booking() {
  return (
    <div>
      <Header />
      <div className="w-full md:bg-custom-gray flex flex-col md:flex-row min-h-screen">
        <Sidebar />
      </div>
      <Footer />
    </div>
  );
}
