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

const siteUrl = "http://localhost:3001";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Adashè-to-Plot | Own Your Plot. Build Your Future.",
    template: "%s | Adashè-to-Plot",
  },

  description:
    "Adashè-to-Plot helps you own verified and affordable land in Anambra, Nigeria. Discover secure plots, flexible payment plans, and trusted real estate investment opportunities.",

  keywords: [
    "Adashè-to-Plot",
    "Adashe to Plot",
    "Adashe-to-Plot",
    "Land for Sale in Anambra",
    "Land for Sale Nigeria",
    "Affordable Land in Anambra",
    "Real Estate in Anambra",
    "Real Estate Nigeria",
    "Property for Sale in Anambra",
    "Plots of Land in Anambra",
    "Buy Land in Nigeria",
    "Land Investment Nigeria",
    "Property Investment Nigeria",
    "Verified Land Nigeria",
    "Affordable Land Nigeria",
    "Estate Land in Anambra",
    "Residential Land Anambra",
    "Land Investment Anambra",
    "Property Investment Anambra",
    "Real Estate Investment Nigeria",
  ],

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },

  openGraph: {
    title: "Adashè-to-Plot | Own Your Plot. Build Your Future.",
    description:
      "Own verified and affordable land in Anambra, Nigeria with Adashè-to-Plot. Explore available plots, flexible payment plans, and secure real estate investment opportunities.",
    url: siteUrl,
    siteName: "Adashè-to-Plot",
    images: [
      {
        url: `${siteUrl}/hero1.png`,
        alt: "Adashè-to-Plot | Verified Land and Property in Anambra",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_NG",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Adashè-to-Plot | Own Your Plot. Build Your Future.",
    description:
      "Discover verified and affordable land in Anambra, Nigeria. Own your plot and build your future with Adashè-to-Plot.",
    images: [`${siteUrl}/hero1.png`],
  },

  alternates: {
    canonical: siteUrl,
  },
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
