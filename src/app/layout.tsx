import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Unbounded } from "next/font/google";
import { site } from "@/content/site";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Cursor } from "@/components/ui/Cursor";
import { Grain } from "@/components/ui/Grain";
import { Preloader } from "@/components/ui/Preloader";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import "./globals.css";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  display: "swap",
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — Portfolio`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
};

export const viewport: Viewport = {
  themeColor: "#08080a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${unbounded.variable} ${instrument.variable} is-loading`}
    >
      <body>
        <noscript>
          <style>{`.preloader{display:none!important}html.is-loading,html.is-loading body{overflow:auto!important}`}</style>
        </noscript>
        <SmoothScroll />
        <Preloader />
        <Cursor />
        <ScrollProgress />
        <Grain />
        {children}
      </body>
    </html>
  );
}
