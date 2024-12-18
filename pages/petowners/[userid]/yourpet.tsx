import React, { useEffect, useState } from "react";
import Header from "@/components/home-page/Header";
import Footer from "@/components/home-page/Footer";
import Sidebar from "@/components/pet-owner/Sidebar";
import withAuth from "@/utils/withAuth";
import { useAuth } from "@/context/authentication";
import axios from "axios";
import YourpetPage from "@/components/pet-owner/yourpet/YourPetPage";
import YourPetEdit from "@/components/pet-owner/yourpet/YourPetEdit";
import YourPetCreate from "@/components/pet-owner/yourpet/YourPetCreate";
import LoadingPage from "@/components/Loading";

interface PetData {
  pet_id: number;
  pet_name: string;
  pet_type: string;
  breed: string;
  sex: string;
  age: string;
  color: string;
  weight: string;
  about: string | null;
  image: string;
  status: string;
}

function YourPet() {
  const { user } = useAuth();

  const [changePage, setchangePage] = useState<string>("Home");
  const [dataPet, setDataPet] = useState<PetData[]>([]);
  const [petIdEdit, setPetIdEdit] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  // console.log(petIdEdit);
  // console.log(dataPet);

  useEffect(() => {
    if (user?.sub) {
      petData();
    }
  }, [user?.sub, petIdEdit, changePage]);
  const petData = async () => {
    try {
      setLoading(false);
      const res = await axios.get(`/api/petowners/pet/${user?.sub}`);
      const data = await res.data.data;
      if(res.status===404){
        setDataPet([]);
      }
  
      setDataPet(data);
      setLoading(true);
    } catch (error) {
      setLoading(false);
      console.log(error);
    } finally {
      setLoading(false); // จบการโหลดข้อมูล
    }
  };

  return (
    <div>
      <Header />
      <div className="w-full md:bg-custom-gray flex flex-col md:flex-row min-h-screen ">
        <Sidebar />
        {/*  check changeContainer กดปุ่มเพ่ือเรียกคอมโพเน้น create มาแสดง */}
        {changePage === "Home" ? (
          loading ? (
            // กรณีข้อมูลกำลังโหลด
            <LoadingPage />
          ) : dataPet && dataPet.length > 0 ? (
            // แสดงข้อมูลสัตว์เลี้ยง ถ้ามีข้อมูล
            <YourpetPage
              dataPet={dataPet}
              setchangePage={setchangePage}
              setPetIdEdit={setPetIdEdit}
            />
          ) : (
            // กรณีไม่มีข้อมูล แสดงหน้าที่
            <YourpetPage
              dataPet={dataPet}
              setchangePage={setchangePage}
              setPetIdEdit={setPetIdEdit}
            />
          )
        ) : changePage === "Create" ? (
          // container create
          <YourPetCreate setchangePage={setchangePage} />
        ) : (
          // container Edit
          <YourPetEdit petIdEdit={petIdEdit} setchangePage={setchangePage} />
        )}
      </div>

      <Footer />
    </div>
  );
}
export default withAuth(YourPet);
