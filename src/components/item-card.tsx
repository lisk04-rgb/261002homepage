import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { CatalogSummary } from "@/types/content";

export function ItemCard({ item, headingLevel = "h3" }: { item: CatalogSummary; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-beige-200 bg-white transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-beige-100">
        <Image
          src={item.images[0] ?? ""}
          alt={item.imageAlt ?? item.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-sm font-medium text-terracotta-700">{item.category}</p>
        <Heading className="mt-1 text-lg font-bold text-navy-900">
          {/* 카드 전체를 클릭 영역으로 만들되 링크 텍스트는 제목만 읽히도록 */}
          <Link href={`/${item.kind}/${item.slug}`} className="after:absolute after:inset-0">
            {item.title}
          </Link>
        </Heading>
        <p className="mt-2 flex-1 text-sm text-navy-700">{item.summary}</p>
        <p className="mt-4 font-bold text-navy-900">{formatPrice(item.price)}</p>
      </div>
    </article>
  );
}
