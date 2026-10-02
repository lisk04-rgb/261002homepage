export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const NAV_LINKS = [
  { href: "/products", label: "상품" },
  { href: "/services", label: "서비스" },
  { href: "/about", label: "소개" },
] as const;

export const KIND_LABELS = { products: "상품", services: "서비스" } as const;
