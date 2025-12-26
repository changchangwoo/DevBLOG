import Link from "next/link";
import { ReactNode, MouseEventHandler } from "react";

interface IconWithLabelLinkProps {
  icon: ReactNode;
  label: string;
  href: string;
  target?: string;
  rel?: string;
  onClick?: never;
  ariaLabel?: string;
  className?: string;
}

interface IconWithLabelButtonProps {
  icon: ReactNode;
  label: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  href?: never;
  target?: never;
  rel?: never;
  ariaLabel?: string;
  className?: string;
}

type IconWithLabelProps = IconWithLabelLinkProps | IconWithLabelButtonProps;

export default function IconWithLabel({
  icon,
  label,
  href,
  target,
  rel,
  onClick,
  ariaLabel,
  className = "",
}: IconWithLabelProps) {
  const content = (
    <>
      <div className="text-descript group-hover:text-primary transition-colors p-[0.5rem] rounded-[6px] group-hover:bg-boundary cursor-pointer">
        {icon}
      </div>
      <span className="caption text-descript opacity-0 group-hover:opacity-100 transition-opacity absolute mt-[3rem]">
        {label}
      </span>
    </>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        aria-label={ariaLabel || label}
        className={`group flex flex-col items-center gap-[0.5rem] ${className}`}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      className={`group flex flex-col items-center gap-[0.5rem] ${className}`}
    >
      {content}
    </Link>
  );
}
