import Divider from "@/components/common/Divider";

interface TILDetailProps {
  selectedDate: string;
  selectedTitle: string;
  selectedContent: string;
}

export default function TILDetail({
  selectedTitle,
  selectedContent,
}: TILDetailProps) {
  return (
    <div>
      <Divider className="title2 " spacing="lg" />
      <div className="w-full  rounded-[8px]  overflow-hidden px-[2rem]">
        <div className="flex items-center justify-between ">
          <div>
            <h1 className="title1 text-primary">{selectedTitle}</h1>
          </div>
        </div>
        <div
          className="
            prose max-w-none
            prose-img:w-full
            prose-img:h-auto
            prose-img:rounded-2xl
            prose-img:border
            prose-img:border-boundary
            dark:prose-invert
          "
          dangerouslySetInnerHTML={{ __html: selectedContent }}
        />
      </div>
    </div>
  );
}
