"use client";

interface TILCalendarProps {
  year: number;
  tilData: Map<string, string>;
  onDateClick: (date: string) => void;
}

export default function TILCalendar({
  year,
  tilData,
  onDateClick,
}: TILCalendarProps) {
  const generateYearDates = () => {
    const dates: Date[] = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      dates.push(new Date(date));
    }

    return dates;
  };

  const groupByWeeks = (dates: Date[]) => {
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];

    const firstDate = dates[0];
    const firstDay = firstDate.getDay();
    for (let i = 0; i < firstDay; i++) {
      currentWeek.push(new Date(0));
    }

    dates.forEach((date) => {
      currentWeek.push(date);

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(new Date(0));
      }
      weeks.push(currentWeek);
    }

    return weeks;
  };

  const formatDate = (date: Date): string => {
    if (date.getTime() === 0) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const dates = generateYearDates();
  const weeks = groupByWeeks(dates);
  const monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const getMonthIndex = (weekIndex: number): string | null => {
    if (weekIndex >= weeks.length) return null;

    const firstDateInWeek = weeks[weekIndex].find((d) => d.getTime() !== 0);
    if (!firstDateInWeek) return null;

    const month = firstDateInWeek.getMonth();

    if (weekIndex === 0) return monthLabels[month];

    const prevWeekFirstDate = weeks[weekIndex - 1]?.find(
      (d) => d.getTime() !== 0
    );
    if (prevWeekFirstDate && prevWeekFirstDate.getMonth() !== month) {
      return monthLabels[month];
    }

    return null;
  };

  return (
    <div className="w-full overflow-x-auto overflow-y-hidden py-[1rem]">
      <div className="inline-block min-w-full ">
        {/* 월 라벨 */}
        <div className="flex gap-[0.2rem] mb-[0.5rem] ml-[2.5rem]">
          {weeks.map((_, weekIndex) => {
            const monthLabel = getMonthIndex(weekIndex);
            return (
              <div
                key={weekIndex}
                className="w-[1.2rem] xl:w-[1.2rem] text-[1rem] text-descript"
              >
                {monthLabel || ""}
              </div>
            );
          })}
        </div>

        {/* 요일 라벨 */}
        <div className="flex gap-[0.4rem]">
          <div className="flex flex-col gap-[0.2rem] mr-[0.5rem]">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="h-[1.2rem] xl:h-[1.2rem] text-[1rem] text-descript flex items-center"
              >
                {day}
              </div>
            ))}
          </div>

          {/* 캘린더 그리드 */}
          <div className="flex gap-[0.2rem]">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[0.2rem]">
                {week.map((date, dayIndex) => {
                  const dateStr = formatDate(date);
                  const tilTitle = dateStr ? tilData.get(dateStr) : undefined;
                  const hasTIL = !!tilTitle;
                  const isPlaceholder = date.getTime() === 0;

                  return (
                    <button
                      key={dayIndex}
                      onClick={() => {
                        if (!isPlaceholder && hasTIL) {
                          onDateClick(dateStr);
                        }
                      }}
                      disabled={isPlaceholder || !hasTIL}
                      className={`
                        w-[1.2rem] h-[1.2rem] xl:w-[1.2rem] xl:h-[1.2rem]
                        rounded-[0.2rem] border border-boundary
                        
                        ${
                          isPlaceholder
                            ? "bg-transparent border-transparent cursor-default"
                            : hasTIL
                            ? "bg-green-500 dark:bg-green-600 hover:ring-2 hover:ring-green-400 cursor-pointer"
                            : "bg-background cursor-default"
                        }
                      `}
                      title={
                        !isPlaceholder && hasTIL
                          ? `${dateStr} - ${tilTitle}`
                          : dateStr
                      }
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
