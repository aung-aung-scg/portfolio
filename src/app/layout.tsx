import type { Metadata } from "next";
import { profile } from "@/data/profile";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || profile.metadata.url),
  title: profile.metadata.title,
  description: profile.metadata.description,
  openGraph: { title: profile.metadata.title, description: profile.metadata.description, type: "profile", locale: "en_US", siteName: profile.name, url: "/" },
  twitter: { card: "summary_large_image", title: profile.metadata.title, description: profile.metadata.description },
  icons: { icon: "/icon.svg" },
};

const themeScript = `try{document.documentElement.dataset.theme=localStorage.getItem('portfolio-theme')==='light'?'light':'dark'}catch{document.documentElement.dataset.theme='dark'}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-theme="dark" suppressHydrationWarning><head><link rel="preload" href="/fonts/instrument-sans-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" /><link rel="preload" href="/fonts/newsreader-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" /><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head><body>{children}</body></html>;
}
