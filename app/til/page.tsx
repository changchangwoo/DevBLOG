import {
  getAllTILsForYear,
  getAllTILsWithHtmlForYear,
  getAvailableYears,
  getCurrentYear,
} from "@/lib/til";
import TILPageClient from "./TILPageClient";
import Divider from "@/components/Divider";

export const metadata = {
  title: "TIL | ChangWoo의 블로그",
  description: "매일의 학습 기록 - Today I Learned",
};

interface TILPageProps {
  searchParams: Promise<{ year?: string }>;
}

export default async function TILPage({ searchParams }: TILPageProps) {
  const params = await searchParams;
  const yearParam = params.year;
  const currentYear = getCurrentYear();
  const selectedYear = yearParam ? parseInt(yearParam, 10) : currentYear;

  // TIL 존재 여부 맵
  const tilData = getAllTILsForYear(selectedYear);

  // 모든 TIL 내용을 HTML로 변환하여 로드
  const tilContentMap = await getAllTILsWithHtmlForYear(selectedYear);

  const availableYears = getAvailableYears();

  // Map을 직렬화 가능한 객체로 변환
  const tilDataObject = Object.fromEntries(tilData);
  const tilContentObject = Object.fromEntries(tilContentMap);

  return (
    <div className="min-h-screen bg-background pt-[5.4rem]">
      <main className="mx-auto max-w-7xl px-[2rem] py-[4rem]">
        {/* 헤더 */}
        <div className="mb-[4rem]">
          <h1 className="title1 text-primary mb-[1rem]">Today I Learned</h1>

        </div>

        <Divider
          spacing="lg"
          label={`${selectedYear}년 학습 기록`}
          className="title2 text-primary"
        />

        {/* 클라이언트 컴포넌트 */}
        <TILPageClient
          year={selectedYear}
          tilData={new Map(Object.entries(tilDataObject))}
          tilContentMap={new Map(Object.entries(tilContentObject))}
          availableYears={availableYears}
        />
      </main>
    </div>
  );
}
