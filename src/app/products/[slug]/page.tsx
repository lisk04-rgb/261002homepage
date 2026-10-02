import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogDetail } from "@/components/catalog-detail";
import { getProducts, getReviews } from "@/lib/content";
import { catalogItemMetadata } from "@/lib/metadata";

type PageProps = { params: Promise<{ slug: string }> };

// content 폴더에 있는 파일만 페이지로 만든다(없는 주소는 404).
export const dynamicParams = false;

export function generateStaticParams() {
  return getProducts().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return catalogItemMetadata(getProducts().find((item) => item.slug === slug));
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const items = getProducts();
  const item = items.find((candidate) => candidate.slug === slug);
  if (!item) notFound();
  return <CatalogDetail item={item} allItems={items} reviews={getReviews()} />;
}
