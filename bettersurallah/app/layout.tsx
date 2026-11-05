import type { Metadata, Viewport } from "next";
import { Public_Sans, Schibsted_Grotesk } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Netlify sets URL to the site's primary address during builds; link previews need absolute URLs.
  metadataBase: new URL(process.env.URL ?? "http://localhost:3000"),
  twitter: { card: "summary_large_image" },
  title: {
    default: "BetterSurallah — Transparency for Surallah, South Cotabato",
    template: "%s · BetterSurallah",
  },
  description:
    "A citizen-built window into how Surallah works — transparency documents, officials, and government projects in one place.",
};

export const viewport: Viewport = {
  themeColor: "#0035ad",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${schibsted.variable} ${publicSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
