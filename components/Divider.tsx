import { cn } from "@/lib/utils";

interface DividerProps {
  className?: string;
  spacing?: "none" | "sm" | "md" | "lg";
  label?: string;
  color?: "boundary" | "primary";
}

const spacingClasses = {
  none: "",
  sm: "my-4",
  md: "my-8",
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
}: Readonly<DividerProps>) {
  if (label) {
    return (
      <div
        className={cn(
          "flex items-center gap-4 w-full",
          spacing !== "none" && spacingClasses[spacing],
          className
        )}
      >
        <span className="text-primary whitespace-nowrap">{label}</span>
        <div className={cn("flex-1 h-[0.5px]", colorClasses[color])} />
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
