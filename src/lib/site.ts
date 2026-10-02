export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export type NavLink = { href: string; label: string };

/** 상품이 하나도 없으면 "상품" 메뉴는 숨긴다(content/products에 파일을 넣으면 자동으로 나타남). */
export function getNavLinks(hasProducts: boolean): NavLink[] {
  return [
    ...(hasProducts ? [{ href: "/products", label: "상품" }] : []),
    { href: "/services", label: "서비스" },
    { href: "/calendar", label: "일정" },
    { href: "/assignments", label: "과제 제출" },
    { href: "/board", label: "게시판" },
    { href: "/about", label: "소개" },
  ];
}

export const KIND_LABELS = { products: "상품", services: "서비스" } as const;
