import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { PROFILE } from "@/lib/data";
import "./globals.css";

const interTight = localFont({
  src: "../fonts/InterTight.woff2",
  variable: "--font-inter-tight",
  weight: "100 900",
  display: "swap",
});
const instrument = localFont({
  src: [
    { path: "../fonts/InstrumentSerif-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/InstrumentSerif-Italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-instrument",
  display: "swap",
});
const mono = localFont({
  src: "../fonts/JetBrainsMono.woff2",
  variable: "--font-jetbrains",
  weight: "100 800",
  display: "swap",
});

const title = `${PROFILE.shortName} — ${PROFILE.role}`;
const description = `${PROFILE.role} (${PROFILE.stackLine}) in ${PROFILE.location}. Payment, industrial and government platforms.`;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title,
  description,
  authors: [{ name: PROFILE.name }],
  openGraph: {
    type: "website",
    title,
    description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: title }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og.jpg"] },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#f4f2ee",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { readonly children: ReactNode }) {
  return (
    <html lang="en" className={`${interTight.variable} ${instrument.variable} ${mono.variable}`}>
      <body>
        {children}
        <noscript>
          <style>{`.rv,.rv-mask>span{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </body>
    </html>
  );
}
