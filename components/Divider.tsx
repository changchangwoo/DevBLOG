import { cn } from "@/lib/utils";

interface DividerProps {
  className?: string;
  spacing?: "none" | "sm" | "md" | "lg";
}

const spacingClasses = {
  none: "",
  sm: "my-4",
  md: "my-8",
  lg: "my-[2rem]",
};

export default function Divider({
  className,
  spacing = "none"
}: Readonly<DividerProps>) {
  return (
    <div
      className={cn(
        "w-full h-[0.5px] bg-boundary",
        spacing !== "none" && spacingClasses[spacing],
        className
      )}
    />
  );
}
