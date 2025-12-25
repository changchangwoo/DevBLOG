import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

const tilDirectory = path.join(process.cwd(), "_til");

export interface TILData {
  date: string; // YYYY-MM-DD 형식
  title: string;
  content: string;
  html: string;
  pinned?: boolean;
}

export interface TILWithHtml {
  date: string;
  title: string;
  html: string;
}

/**
 * 특정 연도의 모든 TIL 날짜 목록 가져오기
 */
export function getTILDates(year: number): string[] {
  const yearDirectory = path.join(tilDirectory, year.toString());

  if (!fs.existsSync(yearDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(yearDirectory);

  return fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => fileName.replace(/\.md$/, ""))
    .sort((a, b) => b.localeCompare(a));
}

export function getTILByDate(date: string): TILData | null {
  try {
    const year = date.split("-")[0];
    const fullPath = path.join(tilDirectory, year, `${date}.md`);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    // date를 문자열로 통일 (Date 객체인 경우 YYYY-MM-DD 형식으로 변환)
    let dateStr = date;
    if (data.date) {
      if (data.date instanceof Date) {
        const d = data.date;
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        dateStr = `${year}-${month}-${day}`;
      } else {
        dateStr = String(data.date);
      }
    }

    return {
      date: dateStr,
      title: data.title || "TIL",
      content,
      html: "",
      pinned: data.pinned || false,
    };
  } catch (error) {
    console.error(`Error reading TIL for date ${date}:`, error);
    return null;
  }
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  return result.toString();
}

export function getAllTILsForYear(year: number): Map<string, string> {
  const dates = getTILDates(year);
  const tilMap = new Map<string, string>();

  dates.forEach((date) => {
    const tilData = getTILByDate(date);
    if (tilData) {
      tilMap.set(date, tilData.title);
    }
  });

  return tilMap;
}

/**
 * 현재 연도 가져오기
 */
export function getCurrentYear(): number {
  return new Date().getFullYear();
}

/**
 * 사용 가능한 모든 연도 목록 가져오기
 */
export function getAvailableYears(): number[] {
  if (!fs.existsSync(tilDirectory)) {
    return [];
  }

  const items = fs.readdirSync(tilDirectory);

  return items
    .filter((item) => {
      const itemPath = path.join(tilDirectory, item);
      return fs.statSync(itemPath).isDirectory() && /^\d{4}$/.test(item);
    })
    .map((year) => parseInt(year, 10))
    .sort((a, b) => b - a); // 최신 연도부터
}

/**
 * 특정 연도의 모든 TIL 데이터를 HTML로 변환하여 가져오기
 */
export async function getAllTILsWithHtmlForYear(
  year: number
): Promise<Map<string, string>> {
  const dates = getTILDates(year);
  const tilMap = new Map<string, string>();

  for (const date of dates) {
    const tilData = getTILByDate(date);
    if (tilData) {
      const html = await markdownToHtml(tilData.content);
      tilMap.set(date, html);
    }
  }

  return tilMap;
}

/**
 * 특정 연도의 Pinned TIL 목록 가져오기
 */
export function getPinnedTILsForYear(year: number): TILData[] {
  const dates = getTILDates(year);
  const pinnedTILs: TILData[] = [];

  dates.forEach((date) => {
    const tilData = getTILByDate(date);
    if (tilData && tilData.pinned) {
      pinnedTILs.push(tilData);
    }
  });

  return pinnedTILs;
}
