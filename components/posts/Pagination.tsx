import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hrefBuilder?: (page: number) => string;
}

const defaultHrefBuilder = (page: number) => (page === 1 ? "/" : `/${page}`);

export default function Pagination({
  currentPage,
  totalPages,
  hrefBuilder = defaultHrefBuilder,
}: PaginationProps) {
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

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
        <span
          aria-disabled="true"
          className="px-[1rem] py-[0.5rem] rounded-[6px] body3 text-descript cursor-not-allowed select-none"
          aria-label="이전 페이지 없음"
        >
          ←
        </span>
      )}

      {pages.map((page) =>
        page === currentPage ? (
          <span
            key={page}
            aria-current="page"
            className="px-[1rem] py-[0.5rem] rounded-[6px] body3 text-primary bg-secondary font-semibold"
          >
            {page}
          </span>
        ) : (
          <Link
            key={page}
            href={hrefBuilder(page)}
            className="px-[1rem] py-[0.5rem] rounded-[6px] body3 text-descript hover:bg-secondary hover:text-primary transition-colors"
            aria-label={`${page}페이지로 이동`}
          >
            {page}
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
        <span
          aria-disabled="true"
          className="px-[1rem] py-[0.5rem] rounded-[6px] body3 text-descript cursor-not-allowed select-none"
          aria-label="다음 페이지 없음"
        >
          →
        </span>
      )}
    </nav>
  );
}
