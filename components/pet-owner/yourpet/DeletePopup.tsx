import React from "react";
import closeicon from "@/public/assets/close-icon.svg";
import Image from "next/image";
import axios from "axios";
import { useAuth } from "@/context/authentication";

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  setchangePage: (page: string) => void;
  petIdEdit: number;
  message: string;
}

export default function DeleteConfirmation({
  isOpen,
  onClose,
  setchangePage,
  petIdEdit,
  message,
}: DeleteConfirmationProps) {
  const { user } = useAuth();

  const onConfirm = async () => {
    try {
      await axios.delete(`/api/petowners/pet/${user?.sub}?pet_id=${petIdEdit}`);
      // หลังจากลบข้อมูลเสร็จ ให้โหลดข้อมูลใหม่
      setchangePage("Home"); // ส่งกลับไปยังหน้า Home
    } catch {
      // console.log(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000066] ">
      <div className="modal-box bg-white p-6 rounded-xl shadow-xl max-w-md ">
        <div className="flex justify-between items-center h-full">
          <h3 className="font-bold text-xl ">Delete Confirmation</h3>
          <Image
            src={closeicon}
            alt=""
            className="pb-1 cursor-pointer"
            onClick={onClose}
          />
        </div>

        <hr />
        <p className="py-7 text-base text-gray-400">{message}</p>
        <div className="flex w-full justify-between">
          <button
            type="button"
            className="w-[159px] h-[48px] flex items-center justify-center rounded-3xl text-base font-bold text-orange-500 bg-[#FFF1EC] "
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="w-[159px] h-[48px] flex items-center justify-center rounded-3xl text-base font-bold text-white bg-orange-500"
            onClick={() => {
              onConfirm();
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
