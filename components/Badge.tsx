interface BadgeProps {
  children: React.ReactNode;
  variant?: "category" | "tag";
  colorClass?: string;
}

export default function Badge({
  children,
  variant = "tag",
  colorClass,
}: BadgeProps) {
  const baseClass = "caption px-4 rounded-[10px]";

  if (variant === "category" && colorClass) {
    return (
      <div className={`${baseClass} ${colorClass} text-white`}>{children}</div>
    );
  }

  return <div className={`${baseClass} bg-secondary`}>{children}</div>;
}
