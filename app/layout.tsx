import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ActiveSectionContextProvider from "@/context/active-section-context";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "Mrityunjay Singh | Mobile App Developer",
  description:
    "Mobile developer building apps end to end — React Native and Kotlin on the surface, Java Spring Boot behind it.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className={`${inter.className} bg-ink text-text`}>
        <ActiveSectionContextProvider>
          <Header />
          {children}
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#16191c",
                color: "#e9eae6",
                border: "1px solid #23272b",
                fontSize: "0.85rem",
              },
            }}
          />
        </ActiveSectionContextProvider>
      </body>
    </html>
  );
}
