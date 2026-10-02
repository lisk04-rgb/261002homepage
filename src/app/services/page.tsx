import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/catalog-browser";
import { Container } from "@/components/container";
import { CtaBanner } from "@/components/cta-banner";
import { PageHeader } from "@/components/page-header";
import { toSummary } from "@/lib/catalog";
import { getServices } from "@/lib/content";

const description = "내집마련 1대1 컨설팅과 4주 코칭을 소개합니다.";

export const metadata: Metadata = {
  title: "서비스",
  description,
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  const items = getServices().map(toSummary);
  return (
    <>
      <PageHeader title="서비스" description={description} />
      <Container className="mt-10">
        <CatalogBrowser items={items} label="서비스" />
      </Container>
      <CtaBanner />
    </>
  );
}
