import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { baseSEO } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = baseSEO;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-gray-900`}
    >
      <head>
        <meta name="theme-color" content="#111827" />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL} />
      </head>
      <body className="min-h-full flex flex-col bg-gray-900 text-gray-100">
        {children}
      </body>
    </html>
  );
}
