import Image from "next/image";
import type { TimelineEntry } from "@/constant/const";

export default function TimelineCard({
  title,
  role,
  period,
  description,
  logo,
}: Readonly<TimelineEntry>) {
  return (
    <div className="flex items-center gap-[1.6rem] p-[1.6rem]">
      <div className="shrink-0 w-[4.8rem] h-[4.8rem] rounded-[6px] overflow-hidden flex items-center justify-center bg-secondary">
        {logo ? (
          <Image
            src={logo}
            alt={`${title} 로고`}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="body1 text-descript" aria-hidden>
            {title.charAt(0)}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-[0.2rem]">
        <span className="body1 font-semibold text-primary">{title}</span>
        {role && <span className="body3 text-descript">{role}</span>}
        <span className="body3 font-light text-descript">{period}</span>
        {description && (
          <span className="caption text-descript">{description}</span>
        )}
      </div>
    </div>
  );
}
