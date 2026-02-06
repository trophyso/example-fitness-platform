import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { NavBar } from "@/components/nav-bar";
import { UserProvider } from "@/components/user-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TrophyFitness",
  description: "Track your fitness and compete with friends.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        <UserProvider>
          <div className="flex min-h-screen">
            <NavBar />
            <main className="flex-1 md:ml-64 pb-20 md:pb-0 px-4 py-6 max-w-5xl mx-auto w-full">
              {children}
            </main>
          </div>
          <Toaster />
        </UserProvider>
      </body>
    </html>
  );
}
