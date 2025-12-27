"use client";

import { useEffect, useRef } from "react";

export default function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const documentHeight = document.documentElement.scrollHeight;
          const windowHeight = window.innerHeight;

          const totalScrollableHeight = documentHeight - windowHeight;
          const progress =
            totalScrollableHeight > 0
              ? scrollTop / totalScrollableHeight
              : 0;

          if (barRef.current) {
            barRef.current.style.transform = `scaleX(${progress})`;
          }

          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] z-50">
      <div
        ref={barRef}
        className="h-full bg-primary origin-left"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
