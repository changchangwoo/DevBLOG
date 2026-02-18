import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "changchangwoo.com" }],
        destination: "https://www.changchangwoo.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
