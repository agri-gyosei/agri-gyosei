import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  title: "兼業農家を支える行政書士 | agri-gyosei.com",
  description: "農業経営と行政手続きの橋渡し。兼業農家の方々を全力でサポートする行政書士事務所です。",
  metadataBase: new URL("https://agri-gyosei.com"),
  alternates: {
    canonical: "https://agri-gyosei.com",
  },
  verification: {
    google: [
      "xoAZpoonISYR9nRvvdGXD9DviORhx2qcxQyF_dzI3zM",
      "16ZACFqQvztbofoWx7eH7GoC9VnFj1Mzjpx6vFzJ9LY",
    ],
  },
  openGraph: {
    title: "兼業農家を支える行政書士",
    description: "農業経営と行政手続きの橋渡し。兼業農家の方々を全力でサポートする行政書士事務所です。",
    url: "https://agri-gyosei.com",
    siteName: "agri-gyosei.com",
    locale: "ja_JP",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-LN7M5117S4"
        strategy="afterInteractive"
      />
      <Script id="ga4" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-LN7M5117S4');
      `}</Script>
    </html>
  );
}
