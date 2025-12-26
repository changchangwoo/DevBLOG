import type { Metadata } from "next";
import "./globals.css";
import "highlight.js/styles/github.css";
import ThemeProvider from "@/components/context/ThemeProvider";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer";

export const metadata: Metadata = {
  title: "changchangwoo 블로그",
  description: "프론트엔드 개발자 이창우의 기술 블로그입니다.",
  icons: {
    icon: "/images/common/fav.png",
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
          <Header />
          <div className="pt-[5.4rem] pb-[2rem]">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
