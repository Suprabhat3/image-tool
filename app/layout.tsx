import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://image-tool-lac.vercel.app/" ||
  "http://localhost:3000";

const siteUrl = rawSiteUrl.startsWith("http")
  ? rawSiteUrl
  : `https://${rawSiteUrl}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ImageTool | On-Device Image Processing & Compression",
    template: "%s | ImageTool",
  },
  description:
    "Crop, resize, and radically compress images directly in your browser. Zero server uploads, absolute privacy, and blazingly fast entirely on your device.",
  keywords: [
    "image compression",
    "image resizer",
    "crop image",
    "client-side processing",
    "privacy image tool",
    "nextjs image tool",
    "webp converter",
  ],
  authors: [{ name: "Suprabhat" }],
  creator: "Suprabhat",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon-32x32.png",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-imagetool-domain.com",
    title: "ImageTool | On-Device Image Processing",
    description:
      "Crop, resize, and radically compress images directly in your browser with absolute privacy.",
    siteName: "ImageTool",
    images: [
      {
        url: "/image-logo.png",
        width: 512,
        height: 512,
        alt: "ImageTool Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ImageTool | On-Device Image Processing",
    description:
      "Crop, resize, and radically compress images directly in your browser with absolute privacy.",
    images: ["/image-logo.png"],
    creator: "@suprabhat_3",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
