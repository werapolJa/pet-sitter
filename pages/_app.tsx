import "@/styles/globals.css";
import type { AppProps } from "next/app";
import jwtInterceptor from "@/utils/jwtInterceptor";
import { AuthProvider } from "@/context/authentication";

jwtInterceptor();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
