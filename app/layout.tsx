import type { Metadata, Viewport } from "next";
import "@fontsource/yatra-one/latin-400.css";
import "@fontsource-variable/inter/wght.css";
import "./globals.css";

// Vercel exposes these automatically — no env setup needed.
const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
const siteUrl = host ? `https://${host}` : "http://localhost:3000";

const title = "🪔 Happy Diwali — The Fun Way";
const description =
  "A little Diwali happiness, a lot of fireworks, and an unnecessary amount of jokes. 😂🪔";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: "Happy Diwali — The Fun Way",
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "Happy Diwali — The Fun Way",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#07060d",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
