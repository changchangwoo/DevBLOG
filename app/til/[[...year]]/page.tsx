import { notFound } from "next/navigation";
import {
  getAllTILsForYear,
  getAllTILsWithHtmlForYear,
  getAvailableYears,
  getCurrentYear,
  getPinnedTILsForYear,
} from "@/lib/til";
import { markdownToHtml } from "@/lib/markdown";
import TILPageClient from "./TILPageClient";
import Divider from "@/components/common/Divider";
import PageLayout from "@/components/layout/PageLayout";
import type { Metadata } from "next";

interface TILPageProps {
  params: Promise<{ year?: string[] }>;
}

/** 인덱스 경로(/til)가 가리키는 연도. 가장 최근 기록이 있는 해를 기본으로 한다. */
function getDefaultYear(): number {
  return getAvailableYears()[0] ?? getCurrentYear();
}

/** URL 세그먼트를 연도로 해석한다. 잘못된 값이면 null. */
function resolveYear(segments: string[] | undefined): number | null {
  if (!segments || segments.length === 0) return getDefaultYear();
  if (segments.length > 1) return null;

  const year = Number(segments[0]);
  if (!/^\d{4}$/.test(segments[0])) return null;

  return getAvailableYears().includes(year) ? year : null;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  // 기본 연도도 /til/{year} 로 접근 가능해야 한다(기존 ?year= 링크 보존).
  // 중복 URL은 canonical로 /til을 가리켜 정리한다.
  return [
    { year: [] as string[] },
    ...getAvailableYears().map((year) => ({ year: [String(year)] })),
  ];
}

export async function generateMetadata({
  params,
}: TILPageProps): Promise<Metadata> {
  const { year: segments } = await params;
  const year = resolveYear(segments);

  // 기본 연도는 /til 이 정규 URL이다
  const canonical =
    year === null || year === getDefaultYear() ? "/til" : `/til/${year}`;

  return {
    title: year ? `TIL ${year} | changchangwoo 블로그` : "TIL",
    description: "매일의 학습 기록 - Today I Learned",
    alternates: { canonical },
  };
}

export default async function TILPage({ params }: TILPageProps) {
  const { year: segments } = await params;
  const selectedYear = resolveYear(segments);

  if (selectedYear === null) {
    notFound();
  }

  const [tilContentMap, pinnedTILsWithHtml] = await Promise.all([
    getAllTILsWithHtmlForYear(selectedYear),
    Promise.all(
      getPinnedTILsForYear(selectedYear).map(async (til) => ({
        date: til.date,
        title: til.title,
        html: await markdownToHtml(til.content),
      })),
    ),
  ]);

  return (
    <PageLayout>
      <section className="flex flex-col gap-[1rem]">
        <Divider spacing="md" label="TIL" className="title2 text-primary" />
        <TILPageClient
          year={selectedYear}
          defaultYear={getDefaultYear()}
          tilData={getAllTILsForYear(selectedYear)}
          tilContentMap={tilContentMap}
          availableYears={getAvailableYears()}
          pinnedTILs={pinnedTILsWithHtml}
        />
      </section>
    </PageLayout>
  );
}
