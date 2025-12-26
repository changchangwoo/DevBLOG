"use client";

import { useEffect, useState } from "react";
import type { TocHeading } from "@/lib/toc";
import Divider from "./Divider";

interface TableOfContentsProps {
  headings: TocHeading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -80% 0px", // 헤더 높이 고려
      }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [headings]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80; // 헤더 높이 + 여백
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      window.history.pushState(null, "", `#${id}`);
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="hidden xl:block absolute">
      <div className="sticky overflow-y-auto ml-[3rem]">
        <Divider label="목차" className="title3" spacing="md" />
        <ul className="space-y-2 body3">
          {headings.map((heading) => {
            const isActive = activeId === heading.id;
            const indent =
              heading.level === 2
                ? "pl-0"
                : heading.level === 3
                ? "pl-4"
                : "pl-0";

            return (
              <li key={heading.id} className={indent}>
                <a
                  href={`#${heading.id}`}
                  onClick={(e) => handleClick(e, heading.id)}
                  className={`block py-1 px-[1rem] hover:bg-background-hover rounded-[8px] ${
                    isActive ? "font-bold" : "text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  {heading.text}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
