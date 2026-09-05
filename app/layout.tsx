import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UtilityBar from "@/components/UtilityBar";
import { company } from "@/content/company";
import { JsonLd, organizationJsonLd, SITE_URL } from "@/lib/site";

/**
 * Archivo, self-hosted.
 *
 * The handoff asked for `next/font` self-hosting Archivo. `next/font/google`
 * would do that too, but it fetches from fonts.googleapis.com at BUILD time,
 * which makes every deploy depend on Google being reachable from the build
 * machine. The woff2 files are committed in app/fonts/ instead (latin subset,
 * from the Fontsource distribution of the same SIL Open Font License release),
 * so the build is hermetic and no request ever leaves the visitor's browser for
 * a third-party font.
 *
 * To add a weight: drop the woff2 in app/fonts/ and add it to the array below.
 */
const archivo = localFont({
  src: [
    { path: "./fonts/archivo-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/archivo-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/archivo-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-archivo",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Proserv — equipment procurement across eight verticals, one purchase order",
    template: "%s · Proserv",
  },
  description: company.who,
  applicationName: company.shortName,
  keywords: [
    "procurement as a service India",
    "equipment supplier Gurugram",
    "multi-category industrial supply",
    "ISO 9001 equipment vendor India",
  ],
  authors: [{ name: company.legalName }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: company.legalName,
    url: SITE_URL,
    title:
      "Proserv — equipment procurement across eight verticals, one purchase order",
    description: company.proposition,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={archivo.variable}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-accent-700 focus:px-4 focus:py-3 focus:text-bg focus:no-underline"
        >
          Skip to content
        </a>
        <UtilityBar />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <JsonLd data={organizationJsonLd} />
      </body>
    </html>
  );
}
