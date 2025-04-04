import type { Metadata } from "next";
import ReactQueryProviders from "@/providers/ReactQueryProvider";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "INTERP.IA | Advanced Project Management",
  description: "Premium platform for managing and optimizing your projects",
};

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" className="h-full bg-gray-100">
        <body className={`${inter.className} h-full`}>
          <ReactQueryProviders>{children}</ReactQueryProviders>
        </body>
      </html>
    </>
  );
}
