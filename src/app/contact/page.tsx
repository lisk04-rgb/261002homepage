import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { getSiteConfig } from "@/lib/content";

export const metadata: Metadata = {
  title: "문의하기",
  description: "내집마련 컨설팅과 코칭에 대해 편하게 문의해 주세요.",
  alternates: { canonical: "/contact" },
};

// Phase 1 임시 페이지: 다른 페이지의 "문의하기" 링크가 깨지지 않도록 연락처만 보여준다. Phase 2에서 문의 폼으로 교체한다.
export default function ContactPage() {
  const site = getSiteConfig();
  return (
    <>
      <PageHeader title="문의하기" description="아래 연락처로 편하게 문의해 주세요. 온라인 문의 폼은 곧 열릴 예정이에요." />
      <Container className="mt-10">
        <dl className="grid max-w-xl gap-4 rounded-2xl bg-white p-6 ring-1 ring-beige-200">
          <div>
            <dt className="text-sm text-navy-500">전화</dt>
            <dd className="text-lg font-semibold text-navy-900">{site.contact.phone}</dd>
          </div>
          <div>
            <dt className="text-sm text-navy-500">이메일</dt>
            <dd className="text-lg font-semibold text-navy-900">{site.contact.email}</dd>
          </div>
          <div>
            <dt className="text-sm text-navy-500">운영 시간</dt>
            <dd className="text-navy-900">{site.contact.hours}</dd>
          </div>
        </dl>
      </Container>
    </>
  );
}
