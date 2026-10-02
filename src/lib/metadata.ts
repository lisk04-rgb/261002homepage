import type { Metadata } from "next";
import type { CatalogItem } from "@/types/content";

export function catalogItemMetadata(item: CatalogItem | undefined): Metadata {
  if (!item) return {};
  const url = `/${item.kind}/${item.slug}`;
  return {
    title: item.title,
    description: item.summary,
    alternates: { canonical: url },
    openGraph: { title: item.title, description: item.summary, url },
  };
}
