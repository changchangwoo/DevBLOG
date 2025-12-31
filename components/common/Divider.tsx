import { cn } from "@/lib/utils";
import Link from "next/link";

interface DividerProps {
  className?: string;
  spacing?: "none" | "sm" | "md" | "lg";
  label?: string;
  color?: "boundary" | "primary";
  expand?: string;
  icon?: React.ReactNode;
}

const spacingClasses = {
  none: "",
  sm: "my-4",
  md: "my-[1rem]",
  lg: "my-[2rem]",
};

const colorClasses = {
  boundary: "bg-boundary",
  primary: "bg-primary",
};

export default function Divider({
  className,
  spacing = "none",
  label,
  color = "boundary",
  expand,
  icon,
}: Readonly<DividerProps>) {
  if (label || icon) {
    return (
      <div
        className={cn(
          "flex items-center gap-4 w-full",
          spacing !== "none" && spacingClasses[spacing],
          className
        )}
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-descript">{icon}</span>}
          {label && (
            <span className="text-primary whitespace-nowrap">{label}</span>
          )}
        </div>
        <div className={cn("flex-1 h-[0.5px]", colorClasses[color])} />
        {expand && (
          <Link
            href={expand}
            rel="noopener noreferrer"
            className="text-descript body3"
          >
            전체보기
          </Link>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full h-[0.5px]",
        colorClasses[color],
        spacing !== "none" && spacingClasses[spacing],
        className
      )}
    />
  );
}
