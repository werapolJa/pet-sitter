import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    // ฟังการกดปุ่ม ESC เพื่อปิด modal
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    // เพิ่ม Event Listener เมื่อ Modal เปิด
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
    }

    // ลบ Event Listener เมื่อคอมโพเนนต์ถูกทำลาย
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen && !isVisible) return null;

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <form method="dialog">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-xl ">Booking Confirmation</h4>
            <button
              className="btn btn-sm btn-circle btn-ghost"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
        </form>
        <div className="divider my-0 "></div>
        <p className="py-4 text-gray-400 font-medium">
          Are you sure to booking this pet sitter?
        </p>
        <div className="flex justify-between">
          <button
            className="btn px-10 py-3 rounded-full font-bold bg-[#FFF1EC] hover:bg-[#FFF1EC] active:bg-[#FFF1EC] border-none text-orange-500"
            onClick={onClose}
          >
            Back
          </button>
          <button
            className={`btn px-10 py-3 font-bold rounded-full text-white bg-orange-500 hover:bg-orange-500`}
            onClick={()=> router.push("/booking/success")}
          >
            Yes, I’m sure
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
