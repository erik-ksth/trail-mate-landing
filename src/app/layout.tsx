import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '../lib/theme-context';
import coverImage from '../../public/cover-image.png';
import { Analytics } from "@vercel/analytics/next"

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TrailMate - Explore Nature Sustainably",
  description: "TrailMate helps you discover eco-friendly trails and plan sustainable outdoor adventures.",
  keywords: ["hiking", "trails", "outdoor activities", "eco-friendly", "sustainable travel", "nature", "adventure", "outdoor exploration"],
  authors: [{ name: "TrailMate Team" }],
  creator: "TrailMate",
  publisher: "TrailMate",
  metadataBase: new URL("https://trytrailmate.vercel.app/"), // Replace with your actual domain
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://trytrailmate.vercel.app/", // Replace with your actual domain
    title: "TrailMate - Explore Nature Sustainably",
    description: "TrailMate helps you discover eco-friendly trails and plan sustainable outdoor adventures.",
    siteName: "TrailMate",
    images: [
      {
        url: coverImage.src,
        width: 1200,
        height: 630,
        alt: "TrailMate - Sustainable Outdoor Adventures",
      },
    ],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${openSans.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
