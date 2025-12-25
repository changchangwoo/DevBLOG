"use client";

import { useState } from "react";
import TILCalendar from "@/components/TILCalendar";
import Divider from "@/components/Divider";

interface TILPageClientProps {
  year: number;
  tilData: Map<string, string>;
  tilContentMap: Map<string, string>;
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

  const selectedContent = selectedDate
    ? tilContentMap.get(selectedDate) || "TIL 내용이 없습니다."
    : "";

  const selectedTitle = selectedDate ? tilData.get(selectedDate) || "TIL" : "";

  return (
    <div className="flex flex-col">
      <section className="w-full bg-secondary p-[2rem] rounded-[8px] flex flex-col gap-[2rem]">
        {availableYears.length > 1 && (
          <div className="flex gap-[1rem] flex-wrap">
            {availableYears.map((y) => (
              <a
                key={y}
                href={`/til?year=${y}`}
                className={`px-[1rem] rounded-[0.8rem] caption border border-boundary ${
                  y === year
                    ? "bg-primary text-boundary"
                    : "bg-background text-primary hover:bg-zinc-200 dark:hover:bg-zinc-700"
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

        <h3 className="body3 text-descript ">
          Today I Learned를 기록하는 공간입니다. <br />
          잔디를 클릭하시면 기록한 내용의 확인이 가능합니다.
          <br />
        </h3>
      </section>

      {selectedDate && (
        <div>
          <Divider label={selectedDate} className="title2 " spacing="lg" />
          <div className="w-full bg- rounded-[8px]  overflow-hidden ">
            <div className="flex items-center justify-between ">
              <div>
                <h2 className="title2 text-primary">{selectedTitle}</h2>
              </div>
            </div>
            <div
              className="px-[2rem] prose max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: selectedContent }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
