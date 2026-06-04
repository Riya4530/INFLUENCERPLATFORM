import "./globals.css";
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://www.influencerconnect.com"
  ),

  title: {
    default: "Influencer Connect",
    template: "%s | Influencer Connect",
  },

  description:
    "Find top influencers across India. Connect brands with food, fashion, lifestyle and tech influencers.",

  keywords: [
    "Influencers India",
    "Food Influencers",
    "Fashion Influencers",
    "Instagram Influencers",
    "Influencer Marketing",
    "Influencer Connect",
  ],

  openGraph: {
    title: "Influencer Connect",
    description:
      "Find top influencers across India",

    url:
      "https://www.influencerconnect.com",

    siteName:
      "Influencer Connect",

    locale: "en_IN",

    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}