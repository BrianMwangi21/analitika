import type { Metadata } from "next";
import { Oxanium, Azeret_Mono } from "next/font/google";
import "./globals.css";

const displayFont = Oxanium({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const bodyFont = Azeret_Mono({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "analitika",
  description: "A futuristic football analytics dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${bodyFont.variable} antialiased`}>
        <div className="app-shell">
          <div className="app-bg" aria-hidden>
            <div className="app-orb app-orb-a" />
            <div className="app-orb app-orb-b" />
            <div className="app-grid" />
            <div className="app-scan" />
            <div className="app-noise" />
            <div className="app-sweep" />
          </div>
          <div className="app-content">{children}</div>
        </div>
      </body>
    </html>
  );
}
