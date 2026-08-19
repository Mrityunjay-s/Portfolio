import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import LoaderGate from "@/components/loader-gate";
import ActiveSectionContextProvider from "@/context/active-section-context";
import { LoaderContextProvider } from "@/context/loader-context";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "Mrityunjay Singh | Dev",
  description:
    "Full stack engineer in Bengaluru building secure Spring Boot microservices, cross-platform React Native apps, and AI agents on Azure AI Foundry.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className={`${inter.className} bg-ink text-text`}>
        <ActiveSectionContextProvider>
          <LoaderContextProvider>
            <LoaderGate />
            <Header />
            {children}
            <Footer />
          </LoaderContextProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "var(--color-surface-2)",
                color: "var(--color-text)",
                border: "1px solid var(--color-line)",
                fontSize: "0.85rem",
              },
            }}
          />
        </ActiveSectionContextProvider>
      </body>
    </html>
  );
}
