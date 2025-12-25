import {
  getAllTILsForYear,
  getAllTILsWithHtmlForYear,
  getAvailableYears,
  getCurrentYear,
} from "@/lib/til";
import TILPageClient from "./TILPageClient";
import Divider from "@/components/Divider";
import MainProfile from "../MainProfile";

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
    <div className="min-h-screen bg-background flex flex-col pt-[5.4rem]">
      <main>
        <div className="mx-auto max-w-[120rem] flex flex-col xl:flex-row gap-[2rem] xl:gap-[5rem] px-[2rem]">
          <div className="hidden xl:block xl:flex-[1.5] xl:min-w-0">
            <MainProfile />
          </div>
          <div className="flex-1 xl:flex-[5] xl:min-w-0">
            <div className="flex flex-col gap-[2rem]">
              <section className="flex flex-col ">
                <Divider
                  spacing="md"
                  label="학습"
                  className="title2 text-primary"
                />
                <h3 className="body3 text-descript mb-[2rem]">
                  Today I Learned를 기록하는 공간입니다. <br />
                  잔디를 클릭하시면 기록한 내용의 확인이 가능합니다.
                  <br />
                </h3>

                <TILPageClient
                  year={selectedYear}
                  tilData={new Map(Object.entries(tilDataObject))}
                  tilContentMap={new Map(Object.entries(tilContentObject))}
                  availableYears={availableYears}
                />
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
