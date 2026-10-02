import Link from "next/link";
import type { ReactNode } from "react";

const VARIANTS = {
  primary: "bg-terracotta-600 text-white hover:bg-terracotta-700",
  secondary: "border border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white",
  light: "bg-beige-50 text-navy-900 hover:bg-beige-200",
} as const;

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: keyof typeof VARIANTS;
  className?: string;
};

export function ButtonLink({ href, children, variant = "primary", className = "" }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center justify-center rounded-full px-6 py-2.5 text-base font-semibold transition-colors ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
