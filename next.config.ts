import type { NextConfig } from "next";

/**
 * NOTE ON STATIC EXPORT.
 *
 * The original handoff asked for "static export where possible" AND a POST
 * route at /api/enquiry. Those are mutually exclusive: `output: "export"`
 * removes route handlers from the build entirely, so the enquiry form would
 * silently 404 on submit.
 *
 * Resolution: no static export. Every page here is statically rendered anyway
 * (Next prerenders them at build time), so the performance is the same; only
 * the one API route runs as a function. If a fully static build is ever
 * required — an S3 bucket, a client's own shared host — move the form to a
 * third-party endpoint (Formspark, Basin, Resend via an edge worker) FIRST,
 * then add `output: "export"` here.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // The only image on the site is the logo, served from /public.
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
