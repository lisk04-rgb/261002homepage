import type { Metadata } from "next";
import { MyPage } from "@/components/my-page";
import { PageHeader } from "@/components/page-header";
import { toSummary } from "@/lib/catalog";
import { getProducts, getServices } from "@/lib/content";

export const metadata: Metadata = {
  title: "마이페이지",
  robots: { index: false, follow: false },
};

export default function MyPageRoute() {
  const items = [...getProducts(), ...getServices()].map(toSummary);
  return (
    <>
      <PageHeader title="마이페이지" description="찜한 서비스와 내가 남긴 후기를 확인할 수 있어요." />
      <MyPage items={items} />
    </>
  );
}
