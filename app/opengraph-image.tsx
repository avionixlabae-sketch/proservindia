import { ImageResponse } from "next/og";
import { company, CIN } from "@/content/company";

export const alt =
  "Proserv — eight equipment verticals, one purchase order. Procurement as a Service, Gurugram.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Type-only OG image, built from the design tokens. No photography anywhere on
 * this site, including the social card.
 */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f3f2f2",
          color: "#201e1d",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 22,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#006200",
              fontWeight: 800,
            }}
          >
            {`${company.positioning} · ${company.city}`}
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 88,
              lineHeight: 1.05,
              fontWeight: 800,
              letterSpacing: -2,
              maxWidth: 940,
            }}
          >
            Eight equipment verticals. One purchase order.
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              height: 4,
              background: "#58009880",
              marginBottom: 24,
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 20,
              color: "#4a4746",
            }}
          >
            <span style={{ fontWeight: 800, color: "#201e1d" }}>
              {company.legalName}
            </span>
            <span>{`ISO 9001:2015 · CIN ${CIN}`}</span>
          </div>
        </div>
      </div>
    ),
    size
  );
}
