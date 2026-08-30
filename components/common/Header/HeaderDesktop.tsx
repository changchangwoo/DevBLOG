"use client";

import Link from "next/link";
import Image from "next/image";
import IconWithLabel from "@/components/common/IconWithLabel";
import { ThemeIcons, ThemeToggleIcon, headerConfig } from "./config";

interface HeaderDesktopProps {
  isVisible: boolean;
  onToggleTheme: () => void;
  onSearchClick: () => void;
}

export default function HeaderDesktop({
  isVisible,
  onToggleTheme,
  onSearchClick,
}: HeaderDesktopProps) {
  const { logo, siteTitle, navigation } = headerConfig;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50  hidden md:block  bg-background transition-transform duration-400
         ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <nav className="mx-auto max-w-[1200px] px-6 py-4">
        <div className="flex items-center justify-between ">
          <Link
            href="/"
            className={`flex items-center gap-2  hover:bg-background-hover  px-3 py-2 rounded-[8px] bg-background`}
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
          <div className="flex items-center gap-6">
            <Link
              href={navigation.about.href}
              className={`body3 text-primary px-3 py-2 rounded-[8px] bg-background hover:bg-background-hover`}
            >
              {navigation.about.label}
            </Link>

            <Link
              href={navigation.til.href}
              className={`body3 text-primary px-3 py-2 rounded-[8px] bg-background hover:bg-background-hover`}
            >
              {navigation.til.label}
            </Link>

            <IconWithLabel
              icon={ThemeIcons.search}
              label="Search"
              onClick={onSearchClick}
              ariaLabel="검색"
              className="rounded-[8px] bg-background hover:bg-background-hover text-descript"
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
              className="rounded-[8px] bg-background hover:bg-background-hover"
            />
          </div>
        </div>
      </nav>
    </header>
  );
}
