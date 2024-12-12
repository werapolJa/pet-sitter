import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/context/authentication";
import { SearchProvider } from "@/context/searchbar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <SearchProvider>
        <Component {...pageProps} />
      </SearchProvider>
    </AuthProvider>
  );
}
