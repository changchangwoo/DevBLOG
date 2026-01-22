import type { Metadata } from "next";
import "./globals.css";
import "highlight.js/styles/github.css";
import ThemeProvider from "@/components/context/ThemeProvider";
import HeaderWrapper from "@/components/common/Header/HeaderWrapper";
import Footer from "@/components/common/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.changchangwoo.com"),
  title: {
    default: "Changchangwoo's blog",
    template: "%s | Changchangwoo 블로그",
  },
  description:
    "프론트엔드 개발자 이창우의 블로그입니다. React, Next.js, TypeScript를 중심으로 프론트엔드 개발 경험과 프로젝트 회고를 기록하고 있습니다.",
  keywords: [
    "프론트엔드",
    "개발 블로그",
    "Next.js",
    "React",
    "TypeScript",
    "웹 개발",
  ],
  authors: [
    {
      name: "이창우",
      url: "https://www.changchangwoo.com/about",
    },
  ],
  creator: "이창우",
  publisher: "changchangwoo",
  icons: {
    icon: "/images/common/fav.png",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "Changchangwoo 블로그",
    title: "Changchangwoo's blog",
    description: "프론트엔드 개발자 이창우의 블로그입니다.",
    images: [
      {
        url: "/images/common/og_img.png",
        width: 1200,
        height: 630,
        alt: "Changchangwoo's blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Changchangwoo's blog",
    description: "프론트엔드 개발자 이창우의 블로그입니다.",
    images: ["/images/common/og_img.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="bg-background">
        <ThemeProvider>
          <HeaderWrapper />
          <div className="pt-[5.4rem] pb-[2rem]s">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
