import Link from "next/link";
import { Container } from "@/components/container";
import type { NavLink } from "@/lib/site";
import type { SiteConfig } from "@/types/content";

export function SiteFooter({ site, navLinks }: { site: SiteConfig; navLinks: NavLink[] }) {
  return (
    <footer className="mt-24 bg-navy-900 text-beige-100">
      <Container className="grid gap-10 py-12 md:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-white">{site.name}</p>
          <p className="mt-2 text-sm text-beige-200">{site.tagline}</p>
        </div>
        <nav aria-label="하단 메뉴">
          <ul className="grid grid-cols-2 gap-2 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contact" className="hover:text-white hover:underline">
                문의하기
              </Link>
            </li>
          </ul>
        </nav>
        <address className="space-y-1 text-sm not-italic text-beige-200">
          <p>전화 {site.contact.phone}</p>
          <p>이메일 {site.contact.email}</p>
          <p>{site.contact.hours}</p>
        </address>
      </Container>
      <div className="border-t border-navy-700">
        <Container className="space-y-1 py-6 text-xs text-beige-200">
          <p>
            상호 {site.business.companyName} · 대표 {site.business.ceo} · 사업자등록번호{" "}
            {site.business.registrationNumber}
          </p>
          <p>주소 {site.business.address}</p>
          <p className="pb-2 text-beige-100">{site.disclaimer}</p>
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
        </Container>
      </div>
    </footer>
  );
}
