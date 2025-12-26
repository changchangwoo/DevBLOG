"use client";

import { useState } from "react";
import Divider from "@/components/common/Divider";
import TILDetail from "./TILDetail";
import Badge from "@/components/common/Badge";
import TILCalendar from "@/components/til/TILCalendar";

interface PinnedTIL {
  date: string;
  title: string;
  html: string;
}

interface TILPageClientProps {
  year: number;
  tilData: Map<string, string>;
  tilContentMap: Map<string, string>;
  availableYears: number[];
  pinnedTILs: PinnedTIL[];
}

export default function TILPageClient({
  year,
  tilData,
  tilContentMap,
  availableYears,
  pinnedTILs,
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

        <h3 className="body3 text-primary ">
          🔥🔥🔥 Today I Learned를 기록하는 공간입니다.
          <br />
          <span className="caption text-descript">
            {" "}
            잔디를 클릭하면 내용확인이 가능합니다.
          </span>
          <br />
        </h3>
      </section>
      {pinnedTILs.length > 0 && (
        <>
          <Divider
            className="title2 text-primary"
            spacing="lg"
            label="Pinned"
          />
          <section className="flex gap-[1rem] flex-wrap">
            {pinnedTILs.map((til) => (
              <button key={til.date} onClick={() => handleDateClick(til.date)}>
                <Badge>{til.title}</Badge>
              </button>
            ))}
          </section>
        </>
      )}

      {selectedDate && (
        <TILDetail
          selectedTitle={selectedTitle}
          selectedContent={selectedContent}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
}
