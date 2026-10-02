import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/catalog-browser";
import { Container } from "@/components/container";
import { CtaBanner } from "@/components/cta-banner";
import { PageHeader } from "@/components/page-header";
import { toSummary } from "@/lib/catalog";
import { getProducts } from "@/lib/content";

const description = "손으로 만든 리빙 소품을 카테고리별로 둘러보세요.";

export const metadata: Metadata = {
  title: "상품",
  description,
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  const items = getProducts().map(toSummary);
  return (
    <>
      <PageHeader title="상품" description={description} />
      <Container className="mt-10">
        <CatalogBrowser items={items} label="상품" />
      </Container>
      <CtaBanner />
    </>
  );
}
