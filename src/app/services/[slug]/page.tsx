import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogDetail } from "@/components/catalog-detail";
import { getServices, getReviews, getSiteConfig } from "@/lib/content";
import { catalogItemMetadata } from "@/lib/metadata";

type PageProps = { params: Promise<{ slug: string }> };

// content 폴더에 있는 파일만 페이지로 만든다(없는 주소는 404).
export const dynamicParams = false;

export function generateStaticParams() {
  return getServices().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return catalogItemMetadata(getServices().find((item) => item.slug === slug));
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const items = getServices();
  const item = items.find((candidate) => candidate.slug === slug);
  if (!item) notFound();
  return <CatalogDetail item={item} allItems={items} reviews={getReviews()} disclaimer={getSiteConfig().disclaimer} />;
}
