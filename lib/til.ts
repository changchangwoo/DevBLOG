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
  content: string;
  html: string;
}

export interface TILWithHtml {
  date: string;
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

    return {
      date: data.date || date,
      content,
      html: "", 
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


export function getAllTILsForYear(year: number): Map<string, boolean> {
  const dates = getTILDates(year);
  const tilMap = new Map<string, boolean>();

  dates.forEach((date) => {
    tilMap.set(date, true);
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
