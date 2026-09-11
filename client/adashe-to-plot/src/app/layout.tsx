import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";
import { TanstackQueryProvider } from "../../context/TanstackQueryProvider";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "../../context/UserContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Adashè-to-Plot | Own Your Plot. Build Your Future.",
  description:
    "Discover verified residential plots and premium property investments across Abuja. Flexible payment plans, secure documentation, and dedicated support from Adashè-to-Plot — pay small small, own a property.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-screen flex-col antialiased">
        {" "}
        <UserProvider>
          <Navbar />
          <main className="flex-1">
            <TanstackQueryProvider>
              <Toaster />
              {children}
            </TanstackQueryProvider>
          </main>
          <Footer />{" "}
        </UserProvider>
      </body>
    </html>
  );
}
