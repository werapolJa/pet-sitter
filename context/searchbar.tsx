import React, { createContext, useState, ReactNode } from "react";

interface SearchContextType {
  selectedPets: string[];
  rating: number | null;
  experience: string;
  handlePetType: (pet: string, isChecked: boolean) => void;
  handleRatingChange: (newRating: number) => void;
  handleExperienceChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  homeResetPetType: () => void;
  textUrl: string;
  clearForm: () => void;
  SearchData: (value: string) => void;
  searchInput: string;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedPets, setSelectedPets] = useState<string[]>([]);
  const [rating, setRating] = useState<number | null>(null);
  const [experience, setExperience] = useState<string>("All");
  const [textUrl, setTextUrl] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  // console.log(selectedPets)
  // console.log(rating)
  // console.log(experience)
  const SearchData = (value: string) => {
    setSearchInput(value);
  };
  const handlePetType = (pet: string, isChecked: boolean) => {
    if (isChecked) {
      if (!selectedPets.includes(pet)) {
        setSelectedPets((prev) => [...prev, pet]);
        setTextUrl((prev) => {
          return prev ? `pet_type=${pet}&${prev}` : `pet_type=${pet}`;
        });
      }
    } else {
      setSelectedPets((prev) => prev.filter((item) => item !== pet));
      setTextUrl((prev) => {
        const updatedUrl = prev
          .split("&")
          .filter((item) => !item.includes(pet))
          .join("&");
        return updatedUrl;
      });
    }
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleExperienceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setExperience(e.target.value);
  };

  const homeResetPetType = () => {
    setSelectedPets([]);
    setTextUrl("");
    setExperience("All");
    setRating(null);
  };
  const clearForm = () => {
    setSelectedPets([]); // เคลียร์ pet type
    setRating(null); // รีเซ็ต rating
    setExperience("All"); // รีเซ็ต experience
    setTextUrl(""); // รีเซ็ต URL
    setSearchInput(""); // เคลียร์ input
  };
  return (
    <SearchContext.Provider
      value={{
        selectedPets,
        rating,
        experience,
        handlePetType,
        handleRatingChange,
        handleExperienceChange,
        homeResetPetType,
        textUrl,
        clearForm,
        SearchData,
        searchInput
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

// custom hook สำหรับการใช้ SearchContext
export const useSearchContext = (): SearchContextType => {
  const context = React.useContext(SearchContext);
  if (!context) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }
  return context;
};
