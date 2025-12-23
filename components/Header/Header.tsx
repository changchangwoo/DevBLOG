"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import HeaderMobile from "./HeaderMobile";
import HeaderDesktop from "./HeaderDesktop";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <HeaderDesktop
        isScrolled={isScrolled}
        mounted={mounted}
        theme={theme}
        setTheme={setTheme}
      />
      <HeaderMobile
        isScrolled={isScrolled}
        mounted={mounted}
        theme={theme}
        setTheme={setTheme}
      />
    </>
  );
}
