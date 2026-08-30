"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import IconWithLabel from "@/components/common/IconWithLabel";
import { MenuIcons, ThemeIcons, ThemeToggleIcon, headerConfig } from "./config";

interface HeaderMobileProps {
  isScrolled: boolean;
  isVisible: boolean;
  onToggleTheme: () => void;
  onSearchClick: () => void;
}

export default function HeaderMobile({
  isScrolled,
  isVisible,
  onToggleTheme,
  onSearchClick,
}: HeaderMobileProps) {
  const [isMenuRequested, setIsMenuRequested] = useState(false);
  const { logo, siteTitle, navigation } = headerConfig;

  // 헤더가 숨겨지면 메뉴도 함께 닫힌 것으로 본다.
  // effect + setState 대신 렌더링 시점에 파생시켜 cascading render를 피한다.
  const isMenuOpen = isMenuRequested && isVisible;

  const navLinks = [navigation.home, navigation.about, navigation.til];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-background md:hidden  transition-transform duration-400 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="px-[2rem] py-[1rem]">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className={`flex items-center gap-[0.5rem] justify-center transition-all duration-200 hover:brightness-90 dark:hover:brightness-110 ${
              isScrolled ? "text-primary" : "text-background"
            }`}
          >
            <Image
              src={logo.light}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              className="block dark:hidden"
            />
            <Image
              src={logo.dark}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              className="hidden dark:block"
            />
            <h1 className="body3 text-primary">{siteTitle}</h1>
          </Link>

          <div className="flex items-center gap-4">
            <IconWithLabel
              icon={ThemeIcons.search}
              label="Search"
              onClick={onSearchClick}
              ariaLabel="검색"
              className="transition-all duration-200 hover:brightness-90 dark:hover:brightness-110 text-descript"
            />
            <IconWithLabel
              icon={ThemeToggleIcon}
              label={
                <>
                  <span className="hidden dark:inline">Light</span>
                  <span className="inline dark:hidden">Dark</span>
                </>
              }
              onClick={onToggleTheme}
              ariaLabel="테마 전환"
              className="transition-all duration-200 hover:brightness-90 dark:hover:brightness-110"
            />
            <IconWithLabel
              icon={isMenuOpen ? MenuIcons.close : MenuIcons.hamburger}
              label="Menu"
              onClick={() => setIsMenuRequested((prev) => !prev)}
              ariaLabel={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
              className="text-zinc-700 dark:text-zinc-300 transition-all duration-200 hover:brightness-90 dark:hover:brightness-110"
            />
          </div>
        </div>

        <nav
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "max-h-[300px] opacity-100 mt-4 pt-4"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-[2rem]">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="body3 text-descript transition-all duration-200 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 w-fit"
                onClick={() => setIsMenuRequested(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
