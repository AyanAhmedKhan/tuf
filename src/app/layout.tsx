import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Interactive Wall Calendar | Premium UI Component",
  description:
    "A stunning interactive wall calendar with date range selection, notes, parallax animations, and glassmorphism design. Built with Next.js, Framer Motion & Tailwind CSS.",
  keywords: [
    "calendar",
    "interactive",
    "wall calendar",
    "date range",
    "notes",
    "framer motion",
    "nextjs",
  ],
  openGraph: {
    title: "Interactive Wall Calendar",
    description: "Premium calendar component with parallax, 3D tilt, and glassmorphism",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)] transition-colors duration-500">
        {children}
      </body>
    </html>
  );
}
