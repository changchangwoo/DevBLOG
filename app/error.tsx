"use client";

import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-[60vh] bg-background flex flex-col items-center justify-center gap-[2rem] px-[2rem] text-center">
      <div className="flex flex-col gap-[1rem]">
        <p className="title1 text-primary">문제가 발생했습니다</p>
        <p className="body1 text-descript">
          페이지를 불러오는 중 오류가 발생했습니다.
        </p>
      </div>
      <button
        onClick={reset}
        className="body3 text-primary px-[1.5rem] py-[0.8rem] rounded-[8px] bg-secondary hover:bg-background-hover transition-colors cursor-pointer"
      >
        다시 시도
      </button>
    </main>
  );
}
