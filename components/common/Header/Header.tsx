"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import type { PostSummary, Tag, Category } from "@/lib/posts";
import HeaderMobile from "./HeaderMobile";
import HeaderDesktop from "./HeaderDesktop";
import SearchModal from "../SearchModal";
import { headerConfig } from "./config";

interface HeaderProps {
  categories: Category[];
  tags: Tag[];
  posts: PostSummary[];
}

export default function Header({ categories, tags, posts }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  // 스크롤 위치는 렌더링에 쓰이지 않으므로 ref로 보관한다.
  // state로 두면 스크롤 프레임마다 리렌더 + 리스너 재등록이 발생한다.
  const lastScrollY = useRef(0);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const currentScrollY = window.scrollY;

      // 값이 실제로 바뀔 때만 리렌더가 일어나도록 이전 값과 비교한다.
      setIsScrolled((prev) => {
        const next = currentScrollY > 20;
        return prev === next ? prev : next;
      });

      setIsVisible((prev) => {
        if (currentScrollY < lastScrollY.current) return true;
        if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
          return false;
        }
        return prev;
      });

      lastScrollY.current = currentScrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleTheme = () =>
    setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <>
      <HeaderDesktop
        isVisible={isVisible}
        onToggleTheme={toggleTheme}
        onSearchClick={() => setIsSearchOpen(true)}
      />
      <HeaderMobile
        isScrolled={isScrolled}
        isVisible={isVisible}
        onToggleTheme={toggleTheme}
        onSearchClick={() => setIsSearchOpen(true)}
      />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        config={headerConfig}
        categories={categories}
        tags={tags}
        posts={posts}
      />
    </>
  );
}
