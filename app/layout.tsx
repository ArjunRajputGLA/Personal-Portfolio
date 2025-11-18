import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Arjun Singh Rajput | AI Innovator & Full-Stack Developer",
  description: "National Hackathon Winner specializing in AI/ML, Full-Stack Development, and building intelligent systems. 600+ LeetCode problems solved.",
  keywords: ["AI Developer", "Full-Stack Developer", "Machine Learning", "React", "Next.js", "National Hackathon Winner"],
  authors: [{ name: "Arjun Singh Rajput" }],
  openGraph: {
    title: "Arjun Singh Rajput | AI Innovator & Full-Stack Developer",
    description: "National Hackathon Winner specializing in AI/ML, Full-Stack Development, and building intelligent systems.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
