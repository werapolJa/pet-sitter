import "@/styles/globals.css";
import type { AppProps } from "next/app";
import jwtInterceptor from "@/utils/jwtInterceptor";

jwtInterceptor()

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
