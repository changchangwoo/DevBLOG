import Divider from "@/components/common/Divider";
import MainProfile from "../../components/common/MainProfile";

export const metadata = {
  title: "About | changchangwoo 블로그",
  description:
    "프론트엔드 개발자 이창우의 기술 블로그입니다. 프로젝트를 즐기며 부족하더라도 씩씩한 사람이 되고싶습니다.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col ">
      <main>
        <div className="max-w-[120rem] mx-auto flex flex-col justify-center items-center px-[2rem] gap-[2rem]">
          <MainProfile />
          <div className="bg-secondary p-[2rem] body3 text-primary rounded-[8px]">
            TBD : 다시 취준ㅠ
          </div>
        </div>
      </main>
    </div>
  );
}
