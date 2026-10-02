import Link from "next/link";
import { Container } from "@/components/container";
import { MobileMenu } from "@/components/mobile-menu";
import { NAV_LINKS } from "@/lib/site";

export function SiteHeader({ siteName }: { siteName: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-beige-200 bg-beige-50/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="text-lg font-bold text-navy-900">
          {siteName}
        </Link>
        <nav aria-label="주요 메뉴" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="font-medium text-navy-700 hover:text-navy-900">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contact"
                className="rounded-full bg-navy-900 px-5 py-2 font-semibold text-white hover:bg-navy-700"
              >
                문의하기
              </Link>
            </li>
          </ul>
        </nav>
        <MobileMenu />
      </Container>
    </header>
  );
}
