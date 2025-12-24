"use client";

import { useState } from "react";
import TILCalendar from "@/components/TILCalendar";
import TILModal from "@/components/TILModal";

interface TILPageClientProps {
  year: number;
  tilData: Map<string, boolean>;
  tilContentMap: Map<string, string>; // date -> HTML content
  availableYears: number[];
}

export default function TILPageClient({
  year,
  tilData,
  tilContentMap,
  availableYears,
}: TILPageClientProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
  };

  const handleCloseModal = () => {
    setSelectedDate(null);
  };

  // 선택된 날짜의 TIL 내용 가져오기
  const selectedContent = selectedDate
    ? tilContentMap.get(selectedDate) || "TIL 내용이 없습니다."
    : "";

  return (
    <div className="space-y-[3rem]">
      {/* 연도 선택 */}
      {availableYears.length > 1 && (
        <div className="flex gap-[1rem] flex-wrap">
          {availableYears.map((y) => (
            <a
              key={y}
              href={`/til?year=${y}`}
              className={`px-[2rem] py-[1rem] rounded-[0.8rem] body3 transition-colors ${
                y === year
                  ? "bg-primary text-white"
                  : "bg-zinc-100 dark:bg-zinc-800 text-primary hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              {y}년
            </a>
          ))}
        </div>
      )}

      {/* 캘린더 */}
      <TILCalendar year={year} tilData={tilData} onDateClick={handleDateClick} />

      {/* 모달 */}
      {selectedDate && (
        <TILModal
          isOpen={!!selectedDate}
          onClose={handleCloseModal}
          date={selectedDate}
          content={selectedContent}
        />
      )}
    </div>
  );
}
