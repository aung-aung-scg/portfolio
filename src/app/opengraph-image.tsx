import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const alt = profile.metadata.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%", height: "100%", background: "#171c19", color: "#e9ede5", padding: "90px", fontFamily: "sans-serif" }}>
      <div style={{ color: "#b1cb91", fontSize: 24, marginBottom: 35 }}>{profile.location}</div>
      <div style={{ display: "flex", fontSize: 100, letterSpacing: -5 }}>{profile.name}<span style={{ color: "#b1cb91" }}>.</span></div>
      <div style={{ fontSize: 32, marginTop: 30 }}>{profile.headline}</div>
    </div>, size,
  );
}
