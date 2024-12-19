import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/context/authentication";
import { SearchProvider } from "@/context/searchbar";
import { BookingProvider } from "@/context/BookingContext";
import { ChatProvider } from "@/context/ChatContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ChatProvider>
      <BookingProvider>
        <SearchProvider>
          <Component {...pageProps} />
        </SearchProvider>
      </BookingProvider>
      </ChatProvider>
    </AuthProvider>
  );
}
