import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import LoaderGate from "@/components/loader-gate";
import ActiveSectionContextProvider from "@/context/active-section-context";
import { LoaderContextProvider } from "@/context/loader-context";
import ThemeContextProvider from "@/context/theme-context";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "Mrityunjay Singh | Dev",
  description:
    "Full stack engineer in Bengaluru building secure Spring Boot microservices, cross-platform React Native apps, and AI agents on Azure AI Foundry.",
};

// Runs before React hydrates, so a returning visitor who chose light never
// sees a flash of dark first. ThemeContextProvider's own effect only
// reconciles React state with whatever this already decided — it can't run
// early enough on its own to prevent the flash, since the first render commit
// happens before any client effect fires.
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var t = localStorage.getItem("portfolio-theme");
    if (t === "light") document.documentElement.setAttribute("data-theme", "light");
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className={`${inter.className} bg-ink text-text`}>
        <ThemeContextProvider>
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
        </ThemeContextProvider>
      </body>
    </html>
  );
}
