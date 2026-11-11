import type { Metadata, Viewport } from "next";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";
import Header, { Footer } from "@/components/Header";
import { CompareBar } from "@/components/Compare";
import Motion from "@/components/Motion";
import { Suspense } from "react";
import Script from "next/script";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "SchoolCove | Find the best preschools and daycares in Gurugram", template: "%s | SchoolCove" },
  description: "Find and compare preschools, playschools and daycares in Gurugram (Gurgaon). Fees, programmes, timings, reviews and directions in one place. Free for parents.",
  openGraph: { type: "website", siteName: "SchoolCove", locale: "en_IN" },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#fffdf9" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
        <CompareBar />
        <Suspense><Motion /></Suspense>
        <Script id="ms-clarity" strategy="afterInteractive">{`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","zc16lyr471");`}</Script>
        <noscript><style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style></noscript>
      </body>
    </html>
  );
}
