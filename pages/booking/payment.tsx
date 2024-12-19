import { useState, ChangeEvent, useEffect } from "react";
import Header from "@/components/home-page/Header";
import bgImg from "@/public/assets/bookingbg.svg";
import Image from "next/image";
import creditcardgraySvg from "@/public/assets/creditcardgray.svg";
import creditcardorangeSvg from "@/public/assets/creditcardorange.svg";
import cashgraySvg from "@/public/assets/cashgray.svg";
import cashorangeSvg from "@/public/assets/cashorange.svg";
import cashbg from "@/public/assets/cashbg.svg";
import { useRouter } from "next/router";
import Input from "@/components/pet-owner/Input";
import { useBookingContext, BookingData } from '@/context/BookingContext';
import Modal from '@/components/Modal';

export default function BookingPaymentPage() {
  const { bookingData, updateBookingData } = useBookingContext();
  const { paymentMethod, cardNumber, cardOwner, expiryDate, cvv, bookingDetail } = bookingData;
  const [isCreditCardHovered, setIsCreditCardHovered] = useState(false);
  const [isCashHovered, setIsCashHovered] = useState(false);

  const [messageCardNumber, setMessageErrorCardNumber] = useState<string>("");
  const [messageErrorexpiryDate, setMessageErrorexpiryDate] =
    useState<string>("");
  const [messageErrorcvv, setMessageErrorCvv] = useState<string>("");

  const [cardNumberError, setCardNumberError] = useState<boolean>(false);
  const [cardOwnerError, setCardOwnerError] = useState<boolean>(false);
  const [expiryDateError, setexpiryDateError] = useState<boolean>(false);
  const [cvvError, setCvvError] = useState<boolean>(false);
  const [btndisable, setBtndisable] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (paymentMethod === "credit") {
      setBtndisable(
        !(
          cardNumber &&
          cardOwner &&
          expiryDate &&
          cvv &&
          !cardNumberError &&
          !cardOwnerError &&
          !expiryDateError &&
          !cvvError
        )
      );
    }
    if (paymentMethod === "cash") {
      setBtndisable(false);
    }
  }, [
    paymentMethod,
    cardNumber,
    cardOwner,
    expiryDate,
    cvv,
    cardNumberError,
    cardOwnerError,
    expiryDateError,
    cvvError,
  ]);

  useEffect(() => {
    if (paymentMethod === "cash") {
      setCardNumberError(false);
      setCardOwnerError(false);
      setexpiryDateError(false);
      setCvvError(false);
    }
  }, [paymentMethod]);

  const router = useRouter();

  const setSelectedPayment = (method: 'credit' | 'cash') => {
    updateBookingData({ paymentMethod: method });
  };

  function handleSubmit() {
    setCardNumberError(false);
    setCardOwnerError(false);
    setexpiryDateError(false);
    setCvvError(false);

    if (paymentMethod === "credit") {
      let hasError = false;

      if (!cardNumber || cardNumber.length < 10) {
        setCardNumberError(true);
        setMessageErrorCardNumber("Please enter a complete credit card number.");
        hasError = true;
      }
      if (!cardOwner) {
        setCardOwnerError(true);
        hasError = true;
      }
      if (!expiryDate || expiryDate.length < 4) {
        setexpiryDateError(true);
        setMessageErrorexpiryDate("Please enter a valid expiry date.");
        hasError = true;
      }
      if (!cvv || cvv.length < 3) {
        setCvvError(true);
        setMessageErrorCvv("Please enter the CVV code.");
        hasError = true;
      }

      if (isNaN(Number(cardNumber))) {
        setCardNumberError(true);
        setMessageErrorCardNumber("The credit card number must be a number.");
        hasError = true;
      }
      if (isNaN(Number(expiryDate))) {
        setexpiryDateError(true);
        setMessageErrorexpiryDate("The expiry date must be a valid number.");
        hasError = true;
      }
      if (isNaN(Number(cvv))) {
        setCvvError(true);
        setMessageErrorCvv("The CVV must be a valid number.");
        hasError = true;
      }

      if (!hasError) {
        setIsModalOpen(true);
      }
    } else {
      setIsModalOpen(true);
    }
  }

  return (
    <div className="w-screen md:h-screen h-auto bg-[#FAFAFB]">
      <Header />
      <main className="md:pt-10 flex gap-9 md:px-12 h-5/6 flex-col md:flex-row">
        <div className="w-full md:w-2/3 flex flex-col gap-4">
          <div className="bg-white w-full h-1/6 rounded-2xl flex justify-between md:justify-center px-5 md:px-0 items-center py-4 md:py-0 gap-0 md:gap-12">
            <div className="flex justify-center items-center gap-3">
              <h3 className="font-bold text-2xl text-orange-500 w-7 h-7 md:w-12 md:h-12 bg-black flex justify-center items-center rounded-full">
                1
              </h3>
              <p className="text-sm md:text-xl font-medium">Your Pet</p>
            </div>
            <div className="flex justify-center items-center gap-3">
              <h3 className="font-bold text-2xl text-orange-500 w-7 h-7 md:w-12 md:h-12 bg-black flex justify-center items-center rounded-full">
                2
              </h3>
              <p className="text-sm md:text-xl font-medium">Information</p>
            </div>
            <div className="flex justify-center items-center gap-3">
              <h3 className="font-bold text-2xl text-white w-7 h-7 md:w-12 md:h-12 bg-orange-500 flex justify-center items-center rounded-full">
                3
              </h3>
              <p className="text-orange-500 text-sm md:text-xl font-medium">
                Payment
              </p>
            </div>
          </div>
          <div className="bg-white w-full h-auto md:h-5/6 px-5 rounded-2xl p-0 md:p-10 flex flex-col justify-between">
            <div>
              <div className="flex justify-center gap-4">
                <button
                  className={`flex items-center justify-center gap-2 w-1/2 py-2 md:py-7 rounded-full border text-[18px] ${
                    paymentMethod === "credit" || isCreditCardHovered
                      ? "border-orange-500 text-orange-500"
                      : "border-gray-200 text-[#7B7E8F]"
                  } font-medium transition-colors duration-300`}
                  onMouseEnter={() => setIsCreditCardHovered(true)}
                  onMouseLeave={() => setIsCreditCardHovered(false)}
                  onClick={() => setSelectedPayment("credit")}
                >
                  <Image
                    src={
                      paymentMethod === "credit" || isCreditCardHovered
                        ? creditcardorangeSvg
                        : creditcardgraySvg
                    }
                    alt="credit card icon"
                    loading="lazy"
                  />
                  Credit Card
                </button>
                <button
                  className={`flex items-center justify-center gap-2 w-1/2 py-2 md:py-7 rounded-full border text-[18px] ${
                    paymentMethod === "cash" || isCashHovered
                      ? "border-orange-500 text-orange-500"
                      : "border-gray-200 text-[#7B7E8F]"
                  } font-medium transition-colors duration-300`}
                  onMouseEnter={() => setIsCashHovered(true)}
                  onMouseLeave={() => setIsCashHovered(false)}
                  onClick={() => setSelectedPayment("cash")}
                >
                  <Image
                    src={
                      paymentMethod === "cash" || isCashHovered
                        ? cashorangeSvg
                        : cashgraySvg
                    }
                    alt="cash icon"
                    loading="lazy"
                  />
                  Cash
                </button>
              </div>
              {paymentMethod === "credit" && (
                <CreditCard
                  updateBookingData={updateBookingData}
                  cardNumberError={cardNumberError}
                  cardOwnerError={cardOwnerError}
                  expiryDateError={expiryDateError}
                  cvvError={cvvError}
                  messageCardNumber={messageCardNumber}
                  messageErrorexpiryDate={messageErrorexpiryDate}
                  messageErrorcvv={messageErrorcvv}
                  setCardNumberError={setCardNumberError}
                  setCvvError={setCvvError}
                  setexpiryDateError={setexpiryDateError}
                />
              )}
              {paymentMethod === "cash" && <Cash />}
            </div>

            <div className="hidden md:flex justify-between">
              <button
                className="btn px-10 py-3 rounded-full font-bold bg-[#FFF1EC] hover:bg-[#FFF1EC] active:bg-[#FFF1EC] border-none text-orange-500"
                onClick={() => router.push("/booking/information")}
              >
                Back
              </button>
              <button
                className={`btn px-10 py-3 font-bold rounded-full ${
                  btndisable
                    ? "text-[#AEB1C3] bg-gray-200 cursor-not-allowed"
                    : "text-white bg-orange-500 hover:bg-orange-500"
                }`}
                onClick={handleSubmit}
                disabled={btndisable}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
        <div className="card bg-white w-full md:w-1/3 h-4/6 rounded-none md:rounded-2xl shadow-xl overflow-hidden">
          <div className="h-5/6 flex flex-col gap-6">
            <h3 className="text-gray-600 font-bold text-2xl px-6 pt-6">
              Booking Detail
            </h3>
            <div className="divider my-0"></div>
            <div className="px-6">
              <span className="text-gray-400 font-medium text-sm">
                Pet Sitter:
              </span>
              <p className="text-gray-600 font-medium">
                <span className="mr-3">{bookingDetail.petSitter ?? '-'}</span>
                <span>{bookingDetail.petSitterName ?? '-'}</span>
              </p>
            </div>
            <div className="px-6">
              <span className="text-gray-400 font-medium text-sm">
                Date & Time:
              </span>
              <p className="text-gray-600 font-medium">
                {bookingDetail.dateTime ?? '-'}
              </p>
            </div>
            <div className="px-6">
              <span className="text-gray-400 font-medium text-sm">
                Duration:
              </span>
              <p className="text-gray-600 font-medium">{bookingDetail.duration ?? '-'}</p>
            </div>
            <div className="px-6">
              <span className="text-gray-400 font-medium text-sm">Pet:</span>
              <p className="text-gray-600 font-medium mb-3 md:mb-0">
                {bookingData.selectedPets.length > 0
                  ? bookingData.selectedPets.map((pet) => pet.pet_name).join(", ")
                  : "-"}
              </p>
            </div>
          </div>
          <div className="h-1/6 bg-black flex justify-between items-center text-white px-6">
            <p className="font-medium py-4">Total</p>
            <p className="text-[18px] font-medium">{bookingDetail.total ?? '-'}</p>
          </div>
        </div>
        <div className="flex md:hidden justify-between mb-10 px-5">
          <button
            className="btn px-10 py-3 rounded-full font-bold bg-[#FFF1EC] hover:bg-[#FFF1EC] active:bg-[#FFF1EC] border-none text-orange-500"
            onClick={() => router.push("/booking/information")}
          >
            Back
          </button>
          <button
            className={`btn px-10 py-3 font-bold rounded-full ${
              btndisable
                ? "text-[#AEB1C3] bg-gray-200 cursor-not-allowed"
                : "text-white bg-orange-500 hover:bg-orange-500"
            }`}
            onClick={handleSubmit}
            disabled={btndisable}
          >
            Confirm Booking
          </button>
        </div>
      </main>
      <Image
        src={bgImg}
        alt="background"
        className="absolute right-0 bottom-0 hidden md:block "
        loading="lazy"
      />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

interface CreditCardProps {
  updateBookingData: (data: Partial<BookingData>) => void;
  cardNumberError: boolean;
  cardOwnerError: boolean;
  expiryDateError: boolean;
  cvvError: boolean;
  messageCardNumber: string;
  messageErrorexpiryDate: string;
  messageErrorcvv: string;
  setCardNumberError: (value: boolean) => void;
  setCvvError: (value: boolean) => void;
  setexpiryDateError: (value: boolean) => void;
}

function CreditCard({
  updateBookingData,
  cardNumberError,
  cardOwnerError,
  expiryDateError,
  cvvError,
  messageErrorcvv,
  messageErrorexpiryDate,
  messageCardNumber,
  setCardNumberError,
  setCvvError,
  setexpiryDateError
}: CreditCardProps) {
  const handleCardnumber = (e: ChangeEvent<HTMLInputElement>) => {
    updateBookingData({ cardNumber: e.target.value });
    setCardNumberError(false);
  };
  const handleCardOwner = (e: ChangeEvent<HTMLInputElement>) => {
    updateBookingData({ cardOwner: e.target.value });
  };
  const handleexpiryDate = (e: ChangeEvent<HTMLInputElement>) => {
    updateBookingData({ expiryDate: e.target.value });
    setexpiryDateError(false);
  };
  const handleCvv = (e: ChangeEvent<HTMLInputElement>) => {
    updateBookingData({ cvv: e.target.value });
    setCvvError(false);
  };

  return (
    <div className="flex flex-col md:gap-10 gap-0">
      <div className="flex flex-col md:flex-row justify-between w-full gap-0 md:gap-10 mt-10">
        <div className="w-full md:w-1/2">
          <Input
            label="Card Number*"
            placeholder="xxx-xxxx-x-xx-xx"
            onChange={handleCardnumber}
            maxLength={12}
            error={cardNumberError}
            errorMsg={messageCardNumber}
          />
        </div>
        <div className="w-full md:w-1/2">
          <Input
            label="Card Owner*"
            placeholder="Card owner name"
            onChange={handleCardOwner}
            error={cardOwnerError}
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between w-full gap-0 md:gap-10">
        <div className="w-full md:w-1/2">
          <Input
            label="Expiry Date*"
            placeholder="MM/YY"
            onChange={handleexpiryDate}
            maxLength={4}
            error={expiryDateError}
            errorMsg={messageErrorexpiryDate}
          />
        </div>
        <div className="w-full md:w-1/2">
          <Input
            label="CVC/CVV*"
            placeholder="xxx"
            onChange={handleCvv}
            maxLength={3}
            error={cvvError}
            errorMsg={messageErrorcvv}
          />
        </div>
      </div>
    </div>
  );
}

export function Cash() {
  return (
    <div className="bg-[#F6F6F9] w-full py-10 flex flex-col justify-center items-center gap-6 rounded-2xl mt-10">
      <Image src={cashbg} alt="method cash background" loading="lazy" />
      <div className="text-center text-gray-600 font-medium">
        <p>If you want to pay by cash,</p>
        <p>you are required to make a cash payment </p>
        <p>upon arrival at the pet sitter&apos;s location.</p>
      </div>
    </div>
  );
}

