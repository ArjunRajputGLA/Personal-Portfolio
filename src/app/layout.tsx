import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ArjunRajput.ai | AI Innovator & Full-Stack Developer",
  description: "Personal portfolio of Arjun Singh Rajput - AI Innovator, Full-Stack Developer, and National Hackathon Winner. Building intelligent, scalable systems.",
  keywords: ["Arjun Singh Rajput", "AI Developer", "Full-Stack Developer", "Portfolio", "LeetCode", "Machine Learning", "React Developer"],
  authors: [{ name: "Arjun Singh Rajput" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "ArjunRajput.ai | AI Innovator & Full-Stack Developer",
    description: "Personal portfolio of Arjun Singh Rajput - Building intelligent, scalable systems.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
