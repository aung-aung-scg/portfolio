import type { Metadata } from "next";
import { en } from "@/data/profile";
import DocumentLayout from "@/components/document-layout";
import NotFound from "./not-found";

export const metadata: Metadata = {
  metadataBase: new URL(en.metadata.url),
  title: en.notFound.title,
  description: en.notFound.description,
  robots: { index: false, follow: true },
  icons: { icon: "/favicon.svg" },
};

export default function GlobalNotFound() {
  return <DocumentLayout locale="en"><NotFound /></DocumentLayout>;
}
