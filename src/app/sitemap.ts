import type { MetadataRoute } from "next";
import { en } from "@/data/profile";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/ja/"].map(path => ({
    url: new URL(path, en.metadata.url).href,
    alternates: { languages: { en: new URL("/", en.metadata.url).href, ja: new URL("/ja/", en.metadata.url).href } },
  }));
}
