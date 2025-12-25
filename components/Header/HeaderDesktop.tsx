"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import IconWithLabel from "@/components/IconWithLabel";

interface HeaderDesktopProps {
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
}

export default function HeaderDesktop({
  isScrolled,
  isVisible,
  mounted,
  theme,
  setTheme,
  config,
  themeIcons,
}: HeaderDesktopProps) {
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50  hidden md:block  bg-background
         ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <nav className="mx-auto max-w-[1200px] px-6 py-4">
        <div className="flex items-center justify-between ">
            <Link
              href="/"
              className={`flex items-center gap-2  hover:brightness-90 dark:hover:brightness-110  px-3 py-2 rounded-[8px] bg-background`}
            >
              <Image
                src={theme === "dark" ? config.logo.dark : config.logo.light}
                alt={config.logo.alt}
                width={config.logo.width}
                height={config.logo.height}
              />
              <h1 className="body3 text-primary">{config.siteTitle}</h1>
            </Link>
          <div className="flex items-center gap-6">
            <Link
              href={config.navigation.about.href}
              className={`body3 text-primary px-3 py-2 rounded-[8px] bg-background hover:brightness-90 dark:hover:brightness-110`}
            >
              {config.navigation.about.labelDesktop}
            </Link>

            <Link
              href={config.navigation.TIL.href}
              className={`body3 text-primary px-3 py-2 rounded-[8px] bg-background hover:brightness-90 dark:hover:brightness-110`}
            >
              {config.navigation.TIL.labelDesktop}
            </Link>

            {mounted && (
              <IconWithLabel
                icon={theme === "dark" ? themeIcons.sun : themeIcons.moon}
                label={theme === "dark" ? "Light" : "Dark"}
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                ariaLabel="테마 전환"
                className="rounded-[8px] bg-background hover:brightness-90 dark:hover:brightness-110"
              />
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
