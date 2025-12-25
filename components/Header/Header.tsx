"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import HeaderMobile from "./HeaderMobile";
import HeaderDesktop from "./HeaderDesktop";

const headerConfig = {
  logo: {
    src: "/images/common/logo.svg",
    alt: "Logo",
    width: 24,
    height: 24,
  },
  siteTitle: "changchangwoo",
  navigation: {
    about: {
      href: "/about",
      labelDesktop: "About",
      labelMobile: "About",
    },
    TIL: {
      href: "/til",
      labelDesktop: "TIL",
      labelMobile: "TIL",
    },
  },
};

const ThemeIcons = {
  sun: (
    <svg
      className="h-[2.4rem] w-[2.4rem]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  ),
  moon: (
    <svg
      className="h-[2.4rem] w-[2.4rem]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  ),
};

// 메뉴 아이콘 SVG
const MenuIcons = {
  hamburger: (
    <svg
      className="h-[2.4rem] w-[2.4rem]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  ),
  close: (
    <svg
      className="h-[2.4rem] w-[2.4rem]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  ),
};

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <>
      <HeaderDesktop
        isScrolled={isScrolled}
        isVisible={isVisible}
        mounted={mounted}
        theme={theme}
        setTheme={setTheme}
        config={headerConfig}
        themeIcons={ThemeIcons}
      />
      <HeaderMobile
        isScrolled={isScrolled}
        isVisible={isVisible}
        mounted={mounted}
        theme={theme}
        setTheme={setTheme}
        config={headerConfig}
        themeIcons={ThemeIcons}
        menuIcons={MenuIcons}
      />
    </>
  );
}
