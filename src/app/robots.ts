import type { MetadataRoute } from "next";
import { en } from "@/data/profile";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: new URL("/sitemap.xml", en.metadata.url).href };
}
