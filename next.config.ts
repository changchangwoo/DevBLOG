import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  images: {
    // AVIF를 먼저 시도하고, 미지원 브라우저는 WebP로 떨어진다.
    formats: ["image/avif", "image/webp"],
    // lib/image.ts의 IMAGE_WIDTHS와 맞춘다.
    deviceSizes: [640, 828, 1080, 1200, 1920, 2048],
    // 최적화 결과를 오래 캐시한다(파일이 바뀌면 URL도 바뀐다).
    minimumCacheTTL: 31536000,
  },
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

// 쿼리 기반 구 URL(/posts?category=, /til?year= 등)의 리다이렉트는 proxy.ts 에서 처리한다.
// redirects()는 매칭된 쿼리 값을 디코딩한 채 Location 헤더에 넣어 비ASCII 값에서 500이 난다.

export default nextConfig;
