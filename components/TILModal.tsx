"use client";

import { useEffect } from "react";

interface TILModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  content: string;
}

export default function TILModal({
  isOpen,
  onClose,
  date,
  content,
}: TILModalProps) {
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // 모달 열릴 때 body 스크롤 방지
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // 날짜 포맷팅 (YYYY-MM-DD -> YYYY년 MM월 DD일)
  const formatDateKorean = (dateStr: string): string => {
    const [year, month, day] = dateStr.split("-");
    return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일`;
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-[2rem]"
      onClick={onClose}
    >
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm" />

      {/* 모달 컨텐츠 */}
      <div
        className="relative w-full max-w-[60rem] max-h-[80vh] bg-background rounded-[1.2rem] shadow-2xl border border-boundary overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-[2rem] border-b border-boundary">
          <div>
            <h2 className="title3 text-primary">{formatDateKorean(date)}</h2>
            <p className="body3 text-descript mt-[0.5rem]">오늘의 학습 기록</p>
          </div>
          <button
            onClick={onClose}
            className="w-[4rem] h-[4rem] flex items-center justify-center rounded-[0.8rem] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="모달 닫기"
          >
            <svg
              className="w-[2.4rem] h-[2.4rem] text-primary"
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
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className="p-[2rem] overflow-y-auto max-h-[calc(80vh-10rem)]">
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <div
              className="body2 text-primary whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>

        {/* 푸터 */}
        <div className="flex items-center justify-end gap-[1rem] p-[2rem] border-t border-boundary bg-zinc-50 dark:bg-zinc-900">
          <button
            onClick={onClose}
            className="px-[2rem] py-[1rem] rounded-[0.8rem] bg-primary text-white hover:opacity-80 transition-opacity body3"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
