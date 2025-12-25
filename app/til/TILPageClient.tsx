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

  const selectedContent = selectedDate
    ? tilContentMap.get(selectedDate) || "TIL 내용이 없습니다."
    : "";

  return (
    <section className="w-full bg-code-block p-[2rem] rounded-[8px]">
      {availableYears.length > 1 && (
        <div className="flex gap-[1rem] flex-wrap">
          {availableYears.map((y) => (
            <a
              key={y}
              href={`/til?year=${y}`}
              className={`px-[1rem]  rounded-[0.8rem] caption border border-boundary ${
                y === year
                  ? "bg-primary text-boundary"
                  : "bg-boundary text-primary hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              {y}
            </a>
          ))}
        </div>
      )}

      <TILCalendar
        year={year}
        tilData={tilData}
        onDateClick={handleDateClick}
      />

      {selectedDate && (
        <TILModal
          isOpen={!!selectedDate}
          onClose={handleCloseModal}
          date={selectedDate}
          content={selectedContent}
        />
      )}
    </section>
  );
}
