import React from "react";

interface ConfirmDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 bg-black/25 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-[400px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 18L18 6M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <hr className="border-gray-200 mb-4" />
        <p className="text-gray-400 text-base mb-6">{message}</p>
        <div className="flex justify-between mt-6">
          <button
            onClick={onCancel}
            className="w-[120px] py-2 rounded-3xl text-base font-bold bg-orange-100 text-orange-500 hover:bg-[#ffe4e4] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-[176px] text-base py-2 rounded-3xl font-bold bg-orange-500 text-white hover:bg-orange-600 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
