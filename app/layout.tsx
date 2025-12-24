import type { Metadata } from "next";
import "./globals.css";
import "highlight.js/styles/github.css";
import ThemeProvider from "@/components/ThemeProvider";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "울창한 숲",
  description: "프론트엔드 개발자 이창우의 기술 블로그입니다.",
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
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
