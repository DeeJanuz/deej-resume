import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daenon Janis | Interactive Resume",
  description:
    "A desktop-style resume and portfolio experience for employment, business, and project discovery.",
};

const fontVariables = {
  "--font-sans-family": manrope.style.fontFamily,
  "--font-display-family": fraunces.style.fontFamily,
} as CSSProperties;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.className} h-full antialiased`}
      style={fontVariables}
    >
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
