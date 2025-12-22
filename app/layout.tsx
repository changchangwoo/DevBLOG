import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "highlight.js/styles/github.css";
import Header from "./components/Header";
import ThemeProvider from "./components/ThemeProvider";

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
      <body className={`pt-16`}>
        <ThemeProvider>
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
