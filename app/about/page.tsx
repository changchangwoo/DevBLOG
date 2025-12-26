import Divider from "@/components/common/Divider";
import MainProfile from "../../components/common/MainProfile";

export const metadata = {
  title: "About | ChangWoo의 블로그",
  description: "프론트엔드 개발자 이창우의 소개",
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
