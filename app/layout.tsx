import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prepicago",
  description:
    "Prepicago is an AI-powered interview assistant that helps you prepare for your next job interview. With Prepicago, you can practice your responses to common interview questions, get real-time feedback on your performance, and even generate answers based on your resume and job description. Try Prepicago today and take control of your job search!",
  keywords: [
    "Prepicago",
    "Interview",
    "AI",
    "AI Interview",
    "AI Interview Agent",
    "Job Interview",
    "Job Interview Assistant",
    "Job Interview Prep",
    "Job Interview Prep Assistant",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased container mx-auto pattern`}
      >
        <Header />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
