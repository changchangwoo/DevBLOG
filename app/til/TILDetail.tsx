import Divider from "@/components/Divider";

interface TILDetailProps {
  selectedDate: string;
  selectedTitle: string;
  selectedContent: string;
}

export default function TILDetail({
  selectedDate,
  selectedTitle,
  selectedContent,
}: TILDetailProps) {
  console.log(selectedDate);
  return (
    <div>
      <Divider className="title2 " spacing="lg" />
      <div className="w-full bg-secondary rounded-[8px]  overflow-hidden p-[2rem]">
        <div className="flex items-center justify-between ">
          <div>
            <h2 className="title2 text-primary">{selectedTitle}</h2>
          </div>
        </div>
        <div
          className="prose max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: selectedContent }}
        />
      </div>
    </div>
  );
}
