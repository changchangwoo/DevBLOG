import {
  getAllTILsForYear,
  getAllTILsWithHtmlForYear,
  getAvailableYears,
  getCurrentYear,
  getPinnedTILsForYear,
  markdownToHtml,
} from "@/lib/til";
import TILPageClient from "./TILPageClient";
import Divider from "@/components/common/Divider";
import PageLayout from "@/components/layout/PageLayout";

export async function generateMetadata({ searchParams }: TILPageProps) {
  return {
    title: "TIL | changchangwoo 블로그",
    description: "매일의 학습 기록 - Today I Learned",
    alternates: {
      canonical: "/til",
    },
  };
}

interface TILPageProps {
  searchParams: Promise<{ year?: string }>;
}

export default async function TILPage({ searchParams }: TILPageProps) {
  const params = await searchParams;
  const yearParam = params.year;
  const currentYear = getCurrentYear();
  const selectedYear = yearParam ? parseInt(yearParam, 10) : currentYear;

  const tilData = getAllTILsForYear(selectedYear);
  const tilContentMap = await getAllTILsWithHtmlForYear(selectedYear);
  const pinnedTILs = getPinnedTILsForYear(selectedYear);
  const pinnedTILsWithHtml = await Promise.all(
    pinnedTILs.map(async (til) => ({
      date: til.date,
      title: til.title,
      html: await markdownToHtml(til.content),
    }))
  );

  const availableYears = getAvailableYears();

  const tilDataObject = Object.fromEntries(tilData);
  const tilContentObject = Object.fromEntries(tilContentMap);

  return (
    <PageLayout>
      <section className="flex flex-col gap-[1rem]">
        <Divider spacing="md" label="TIL" className="title2 text-primary" />
        <TILPageClient
          year={selectedYear}
          tilData={new Map(Object.entries(tilDataObject))}
          tilContentMap={new Map(Object.entries(tilContentObject))}
          availableYears={availableYears}
          pinnedTILs={pinnedTILsWithHtml}
        />
      </section>
    </PageLayout>
  );
}
