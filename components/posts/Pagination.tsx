import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hrefBuilder?: (page: number) => string;
  /** 현재 페이지 좌우로 함께 노출할 페이지 수 */
  siblingCount?: number;
}

const defaultHrefBuilder = (page: number) => (page === 1 ? "/" : `/${page}`);

const ELLIPSIS = "ellipsis" as const;
type PageItem = number | typeof ELLIPSIS;

/**
 * 항상 첫/끝 페이지와 현재 페이지 주변만 노출하고 나머지는 …으로 접는다.
 * 포스트가 늘어나도 버튼 개수가 일정하게 유지된다.
 */
function buildPageItems(
  currentPage: number,
  totalPages: number,
  siblingCount: number,
): PageItem[] {
  const start = Math.max(2, currentPage - siblingCount);
  const end = Math.min(totalPages - 1, currentPage + siblingCount);

  const items: PageItem[] = [1];

  if (start > 2) items.push(ELLIPSIS);
  for (let page = start; page <= end; page++) items.push(page);
  if (end < totalPages - 1) items.push(ELLIPSIS);

  if (totalPages > 1) items.push(totalPages);

  return items;
}

const linkClass =
  "px-[1rem] py-[0.5rem] rounded-[6px] body3 text-descript hover:bg-secondary hover:text-primary transition-colors";
const inactiveClass =
  "px-[1rem] py-[0.5rem] rounded-[6px] body3 text-descript cursor-not-allowed select-none";

export default function Pagination({
  currentPage,
  totalPages,
  hrefBuilder = defaultHrefBuilder,
  siblingCount = 1,
}: PaginationProps) {
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;
  const items = buildPageItems(currentPage, totalPages, siblingCount);

  return (
    <nav
      aria-label="페이지 네비게이션"
      className="flex items-center justify-center gap-[0.5rem] py-[2rem]"
    >
      {hasPrev ? (
        <Link
          href={hrefBuilder(currentPage - 1)}
          className="px-[1rem] py-[0.5rem] rounded-[6px] body3 text-primary hover:bg-secondary transition-colors"
          aria-label="이전 페이지"
        >
          ←
        </Link>
      ) : (
        <span aria-hidden="true" className={inactiveClass}>
          ←
        </span>
      )}

      {items.map((item, index) =>
        item === ELLIPSIS ? (
          <span
            key={`ellipsis-${index}`}
            aria-hidden="true"
            className="px-[0.5rem] body3 text-descript select-none"
          >
            …
          </span>
        ) : item === currentPage ? (
          <span
            key={item}
            aria-current="page"
            className="px-[1rem] py-[0.5rem] rounded-[6px] body3 text-primary bg-secondary font-semibold"
          >
            {item}
          </span>
        ) : (
          <Link
            key={item}
            href={hrefBuilder(item)}
            className={linkClass}
            aria-label={`${item}페이지로 이동`}
          >
            {item}
          </Link>
        ),
      )}

      {hasNext ? (
        <Link
          href={hrefBuilder(currentPage + 1)}
          className="px-[1rem] py-[0.5rem] rounded-[6px] body3 text-primary hover:bg-secondary transition-colors"
          aria-label="다음 페이지"
        >
          →
        </Link>
      ) : (
        <span aria-hidden="true" className={inactiveClass}>
          →
        </span>
      )}
    </nav>
  );
}
