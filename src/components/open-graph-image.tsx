import { ImageResponse } from "next/og";
import { en as profile } from "@/data/profile";

export const alt = profile.metadata.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: "#191816", color: "#f2eee6", padding: "58px 70px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 23, color: "#e4a181", borderBottom: "1px solid #4b443b", paddingBottom: 24 }}><span>{profile.name}</span><span>{profile.location}</span></div>
      <div style={{ fontSize: 64, lineHeight: 1.12, letterSpacing: -2, marginTop: 48 }}>{profile.headlineLead}</div>
      <div style={{ fontSize: 55, lineHeight: 1.12, color: "#e4a181", marginTop: 5 }}>{profile.headlineRest}</div>
      <div style={{ display: "flex", gap: 50, borderTop: "1px solid #4b443b", paddingTop: 25, marginTop: 45 }}>{profile.proof.map(item => <div key={item.label} style={{ display: "flex", flexDirection: "column", gap: 9 }}><span style={{ fontSize: 39 }}>{item.value}</span><span style={{ fontSize: 18, color: "#c0b6aa" }}>{item.label}</span></div>)}</div>
    </div>, size,
  );
}
