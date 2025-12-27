"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import IconWithLabel from "@/components/common/IconWithLabel";

interface HeaderMobileProps {
  isScrolled: boolean;
  isVisible: boolean;
  mounted: boolean;
  theme: string | undefined;
  setTheme: (theme: string) => void;
  config: {
    logo: {
      light: string;
      dark: string;
      alt: string;
      width: number;
      height: number;
    };
    siteTitle: string;
    navigation: {
      home: {
        href: string;
        labelDesktop: string;
        labelMobile: string;
      };
      about: {
        href: string;
        labelDesktop: string;
        labelMobile: string;
      };
      TIL: {
        href: string;
        labelDesktop: string;
        labelMobile: string;
      };
    };
  };
  themeIcons: {
    sun: React.ReactElement;
    moon: React.ReactElement;
  };
  menuIcons: {
    hamburger: React.ReactElement;
    close: React.ReactElement;
  };
}

export default function HeaderMobile({
  isScrolled,
  isVisible,
  mounted,
  theme,
  setTheme,
  config,
  themeIcons,
  menuIcons,
}: HeaderMobileProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [isVisible]);

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
            {mounted && (
              <Image
                src={theme === "dark" ? config.logo.dark : config.logo.light}
                alt={config.logo.alt}
                width={config.logo.width}
                height={config.logo.height}
              />
            )}
            <h1 className="body3 text-primary">{config.siteTitle}</h1>
          </Link>

          <div className="flex items-center gap-4">
            {mounted && (
              <IconWithLabel
                icon={theme === "dark" ? themeIcons.sun : themeIcons.moon}
                label={theme === "dark" ? "Light" : "Dark"}
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                ariaLabel="테마 전환"
                className="transition-all duration-200 hover:brightness-90 dark:hover:brightness-110"
              />
            )}
            <IconWithLabel
              icon={isMenuOpen ? menuIcons.close : menuIcons.hamburger}
              label={isMenuOpen ? "Menu" : "Menu"}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
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
            <Link
              href={config.navigation.home.href}
              className="body3 text-descript transition-all duration-200 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 w-fit"
              onClick={() => setIsMenuOpen(false)}
            >
              {config.navigation.home.labelMobile}
            </Link>
            <Link
              href={config.navigation.about.href}
              className="body3 text-descript transition-all duration-200 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 w-fit"
              onClick={() => setIsMenuOpen(false)}
            >
              {config.navigation.about.labelMobile}
            </Link>
            <Link
              href={config.navigation.TIL.href}
              className="body3 text-descript transition-all duration-200 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 w-fit"
              onClick={() => setIsMenuOpen(false)}
            >
              {config.navigation.TIL.labelMobile}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
