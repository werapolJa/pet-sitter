import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Pet {
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

interface BookingDetail {
  petSitter: string | null;
  petSitterName: string | null;
  dateTime: string | null;
  duration: string | null;
  total: string | null;
}

interface BookingData {
  selectedPets: Pet[];
  fullname: string;
  email: string;
  phone: string;
  additionalMsg: string | null;
  paymentMethod: 'credit' | 'cash';
  cardNumber: string | null;
  cardOwner: string | null;
  expiryDate: string | null;
  cvv: string | null;
  bookingDetail: BookingDetail;
}

interface BookingContextType {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBookingContext = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookingContext must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookingData, setBookingData] = useState<BookingData>({
    selectedPets: [],
    fullname: '',
    email: '',
    phone: '',
    additionalMsg: null,
    paymentMethod: 'credit',
    cardNumber: null,
    cardOwner: null,
    expiryDate: null,
    cvv: null,
    bookingDetail: {
      petSitter: null,
      petSitterName: null,
      dateTime: null,
      duration: null,
      total: null,
    },
  });

  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData(prevData => ({ ...prevData, ...data }));
  };

  return (
    <BookingContext.Provider value={{ bookingData, updateBookingData }}>
      {children}
    </BookingContext.Provider>
  );
};

export type { BookingData, BookingDetail, Pet };

