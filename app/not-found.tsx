import Link from "next/link";

export const metadata = {
  title: "페이지를 찾을 수 없습니다",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="min-h-[60vh] bg-background flex flex-col items-center justify-center gap-[2rem] px-[2rem] text-center">
      <div className="flex flex-col gap-[1rem]">
        <p className="title1 text-primary">404</p>
        <p className="body1 text-descript">
          요청하신 페이지를 찾을 수 없습니다.
        </p>
      </div>
      <Link
        href="/"
        className="body3 text-primary px-[1.5rem] py-[0.8rem] rounded-[8px] bg-secondary hover:bg-background-hover transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </main>
  );
}
