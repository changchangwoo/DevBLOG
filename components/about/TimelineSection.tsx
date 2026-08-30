import Image from "next/image";
import Divider from "@/components/common/Divider";
import TimelineCard from "@/components/about/TimelineCard";
import type { TimelineEntry } from "@/constant/const";

interface TimelineSectionProps {
  label: string;
  subLabel?: string;
  entries: TimelineEntry[];
  groupEntries?: boolean;
}

export default function TimelineSection({
  label,
  subLabel,
  entries,
  groupEntries = false,
}: Readonly<TimelineSectionProps>) {
  if (entries.length === 0) return null;

  return (
    <section className="w-full md:w-1/2 mx-auto">
      <Divider
        label={label}
        subLabel={subLabel}
        spacing="md"
        className="title2"
      />
      {groupEntries ? (
        <div className="pt-[2rem]">
          <div className="p-[1.6rem]">
            <div className="flex items-center gap-[1.6rem]">
              <div className="shrink-0 size-[4.8rem] rounded-[6px] overflow-hidden bg-secondary">
                {entries[0].logo ? (
                  <Image
                    src={entries[0].logo}
                    alt={`${entries[0].title} 로고`}
                    width={48}
                    height={48}
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="flex size-full items-center justify-center body1 text-descript">
                    {entries[0].title.charAt(0)}
                  </span>
                )}
              </div>
              <span className="body1 font-semibold text-primary">
                {entries[0].title}
              </span>
            </div>

            <div className="relative mt-[2.8rem] flex flex-col gap-[3.2rem]">
              {entries.map((entry, index) => (
                <div
                  key={`${entry.title}-${entry.period}`}
                  className="relative pl-[6.4rem]"
                >
                  {index < entries.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute left-[2.4rem] top-[1.1rem] h-[calc(100%+3.2rem)] w-[0.5px] bg-boundary"
                    />
                  )}
                  <span
                    aria-hidden
                    className="absolute left-[2.4rem] top-[1.1rem] size-[0.8rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-dot"
                  />
                  <div className="flex flex-col gap-[0.2rem]">
                    <span className="body1 font-semibold text-primary">
                      {entry.role}
                    </span>
                    <span className="body3 font-light text-descript">
                      {entry.period}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="pt-[2rem] flex flex-col gap-[1.2rem]">
          {entries.map((entry) => (
            <TimelineCard
              key={`${entry.title}-${entry.period}`}
              {...entry}
            />
          ))}
        </div>
      )}
    </section>
  );
}
