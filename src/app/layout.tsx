import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Khang Nguyen · Interactive 3D Web Developer",
  description: "Full-stack developer building interactive 3D web experiences with Three.js. Based in Ho Chi Minh City.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable} scroll-smooth`}>
      <head>
        <noscript><style>{`.reveal{opacity:1!important;transform:none!important}`}</style></noscript>
      </head>
      <body>
        <div aria-hidden className="bg-grid pointer-events-none fixed inset-0 -z-10" />
        {children}
      </body>
    </html>
  );
}
