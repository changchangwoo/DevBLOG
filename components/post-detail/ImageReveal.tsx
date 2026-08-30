"use client";

import { useEffect } from "react";

/**
 * 본문 이미지가 완전히 로드된 뒤에 나타나게 한다.
 *
 * 블러를 background-image로 심어두면 이미지가 그 위에 덮이는데,
 * 브라우저는 다운로드되는 대로 위에서부터 그려 넣기 때문에
 * "조금씩 채워지는" 모습이 보인다. 로드가 끝난 뒤 한 번에 보여주면
 * 블러 → 완성 이미지로 깔끔하게 전환된다.
 *
 * 마크다운 본문은 dangerouslySetInnerHTML로 주입되어 React가 관리하지 않으므로
 * DOM에서 직접 찾는다.
 */
export default function ImageReveal() {
  useEffect(() => {
    const images =
      document.querySelectorAll<HTMLImageElement>(".prose img.md-img");

    const reveal = (img: HTMLImageElement) => img.classList.add("is-loaded");

    const cleanups = Array.from(images).map((img) => {
      if (img.complete) {
        reveal(img);
        return () => {};
      }

      const onSettled = () => reveal(img);
      img.addEventListener("load", onSettled, { once: true });
      // 실패해도 계속 숨겨두지 않는다 (alt 텍스트라도 보이도록)
      img.addEventListener("error", onSettled, { once: true });

      return () => {
        img.removeEventListener("load", onSettled);
        img.removeEventListener("error", onSettled);
      };
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
