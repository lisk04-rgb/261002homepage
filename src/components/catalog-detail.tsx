import Link from "next/link";
import { ButtonLink } from "@/components/button-link";
import { Container } from "@/components/container";
import { CtaBanner } from "@/components/cta-banner";
import { ImageGallery } from "@/components/image-gallery";
import { ItemCard } from "@/components/item-card";
import { MdxContent } from "@/components/mdx-content";
import { ReviewSection } from "@/components/review-section";
import { WishlistButton } from "@/components/wishlist-button";
import { getRelatedItems, toSummary } from "@/lib/catalog";
import { PRICE_ON_INQUIRY, formatPrice } from "@/lib/format";
import { KIND_LABELS } from "@/lib/site";
import type { CatalogItem, Review } from "@/types/content";

type CatalogDetailProps = { item: CatalogItem; allItems: CatalogItem[]; reviews: Review[]; disclaimer: string };

export function CatalogDetail({ item, allItems, reviews, disclaimer }: CatalogDetailProps) {
  const kindLabel = KIND_LABELS[item.kind];
  const related = getRelatedItems(allItems, item).map(toSummary);
  const itemKey = `${item.kind}/${item.slug}` as const;
  const inquiryHref = `/contact?item=${encodeURIComponent(itemKey)}`;

  return (
    <>
      <Container className="pt-6">
        <nav aria-label="현재 위치" className="text-sm text-navy-500">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href="/" className="hover:underline">
                홈
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={`/${item.kind}`} className="hover:underline">
                {kindLabel}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-navy-900">
              {item.title}
            </li>
          </ol>
        </nav>
      </Container>

      <Container className="mt-6 grid gap-10 lg:grid-cols-2">
        <ImageGallery images={item.images} alt={item.imageAlt ?? item.title} />

        <div>
          <p className="font-medium text-terracotta-700">{item.category}</p>
          <h1 className="mt-2 text-3xl font-bold text-navy-900">{item.title}</h1>
          <p className="mt-3 text-lg text-navy-700">{item.summary}</p>

          <div className="mt-6 rounded-2xl bg-beige-100 p-5">
            <p className="text-sm text-navy-500">가격</p>
            <p className="mt-1 text-2xl font-bold text-navy-900">{formatPrice(item.price)}</p>
            {item.price === undefined && (
              <p className="mt-1 text-sm text-navy-700">
                옵션과 수량에 따라 달라져 {PRICE_ON_INQUIRY}해 드려요.
              </p>
            )}
          </div>

          {item.tags.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="태그">
              {item.tags.map((tag) => (
                <li key={tag} className="rounded-full bg-white px-3 py-1 text-sm text-navy-700 ring-1 ring-beige-300">
                  #{tag}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={inquiryHref}>이 {kindLabel} 문의하기</ButtonLink>
            <WishlistButton itemKey={itemKey} title={item.title} />
            <ButtonLink href={`/${item.kind}`} variant="secondary">
              {kindLabel} 목록 보기
            </ButtonLink>
          </div>
        </div>
      </Container>

      <Container className="mt-16">
        <section aria-labelledby="description-title" className="max-w-3xl">
          <h2 id="description-title" className="text-2xl font-bold text-navy-900">
            자세한 설명
          </h2>
          <div className="mt-4">
            <MdxContent source={item.description} />
          </div>
        </section>
      </Container>

      <Container className="mt-8">
        <p className="max-w-3xl rounded-xl bg-beige-100 p-4 text-sm text-navy-700">{disclaimer}</p>
      </Container>

      <Container className="mt-16">
        <ReviewSection itemKey={itemKey} staticReviews={reviews.filter((review) => review.target === itemKey)} />
      </Container>

      {related.length > 0 && (
        <Container className="mt-20">
          <section aria-labelledby="related-title">
            <h2 id="related-title" className="text-2xl font-bold text-navy-900">
              함께 보면 좋은 {kindLabel}
            </h2>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((relatedItem) => (
                <li key={relatedItem.slug}>
                  <ItemCard item={relatedItem} />
                </li>
              ))}
            </ul>
          </section>
        </Container>
      )}

      <CtaBanner />
    </>
  );
}
