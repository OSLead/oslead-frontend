
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "react-scroll-to-top"
import ScrollToTopButton from  "./ScrollToTopButton"
import Footer from "@/components/footer/page";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "SWOC 24",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={[inter.className, "bg-[#0D0F16]"].join(" ")}>
        {children}
        <ScrollToTopButton />
      </body>
    </html>
  );
}