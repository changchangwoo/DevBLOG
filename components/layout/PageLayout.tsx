import MainProfile from "@/components/common/MainProfile";
import ScrollProgressBar from "../post-detail/ScrollProgressBar";
import Divider from "../common/Divider";
import CategoryList from "../common/CategoryList";

interface PageLayoutProps {
  children: React.ReactNode;
  showProgressBar?: boolean;
}

export default function PageLayout({
  children,
  showProgressBar = false,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {showProgressBar && <ScrollProgressBar />}
      <main>
        <div className="mx-auto max-w-[120rem] flex flex-col xl:flex-row gap-[2rem] xl:gap-[5rem] px-[2rem]">
          <div className="hidden xl:flex xl:flex-[1.5] xl:min-w-0 flex-col gap-[2rem]">
            <MainProfile />
            <CategoryList />
          </div>
          <div className="flex-1 xl:flex-[5] xl:min-w-0">
            <div className="flex flex-col gap-[2rem]">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
