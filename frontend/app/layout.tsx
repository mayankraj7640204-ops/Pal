import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SAAR | Zero-Cloud Local Intelligence",
  description: "Extract the signal. Drop the noise. A privacy-first local AI distillation engine for chaotic group chats. Built for the PALS Hackathon.",
  keywords: ["AI", "Local AI", "Privacy", "Chat Distillation", "Zero-Cloud"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased overflow-y-auto overflow-x-hidden">
      <head>
        <link href="https://db.onlinewebfonts.com/c/5ac3fe7c6abd2f62067f266d89671492?family=HelveticaNowDisplay-Medium" rel="stylesheet" />
        <link href="https://db.onlinewebfonts.com/c/1aa3377e489837a26d019bba501e779d?family=HelveticaNowDisplayW01-Rg" rel="stylesheet" />
      </head>
      <body className="overflow-y-auto overflow-x-hidden">{children}</body>
    </html>
  );
}
