interface BadgeProps {
  children: React.ReactNode;
  variant?: "category" | "tag";
  colorClass?: string;
  active?: boolean;
}

export default function Badge({
  children,
  variant = "tag",
  colorClass,
  active = false,
}: BadgeProps) {
  const baseClass =
    "caption px-4 rounded-[10px] cursor-pointer border border-boundary ";

  if (variant === "category" && colorClass) {
    return (
      <div className={`${baseClass} ${colorClass} text-white border-none`}>
        {children}
      </div>
    );
  }

  return <div className={`${baseClass} ${colorClass} `}>{children}</div>;
}
