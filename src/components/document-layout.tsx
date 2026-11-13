import type { Metadata } from "next";
import type { Profile } from "@/data/profile";
import "@/app/globals.css";

export function pageMetadata(p: Profile): Metadata {
  const path = p.locale === "ja" ? "/ja/" : "/";
  return {
    metadataBase: new URL(p.metadata.url),
    title: p.metadata.title,
    description: p.metadata.description,
    alternates: { canonical: path, languages: { en: "/", ja: "/ja/", "x-default": "/" } },
    openGraph: {
      title: p.metadata.title, description: p.metadata.description, type: "profile",
      locale: p.locale === "ja" ? "ja_JP" : "en_US",
      alternateLocale: p.locale === "ja" ? "en_US" : "ja_JP",
      siteName: p.name, url: path,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: p.metadata.title }],
    },
    twitter: { card: "summary_large_image", title: p.metadata.title, description: p.metadata.description, images: ["/opengraph-image"] },
    icons: { icon: "/icon.svg" },
  };
}

const themeScript = `try{document.documentElement.dataset.theme=localStorage.getItem('portfolio-theme')==='light'?'light':'dark'}catch{document.documentElement.dataset.theme='dark'}`;

export default function DocumentLayout({ children, locale }: { children: React.ReactNode; locale: Profile["locale"] }) {
  return <html lang={locale} data-theme="dark" suppressHydrationWarning><head>{locale === "en" && <><link rel="preload" href="/fonts/instrument-sans-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" /><link rel="preload" href="/fonts/newsreader-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" /></>}<script dangerouslySetInnerHTML={{ __html: themeScript }} /></head><body>{children}</body></html>;
}
