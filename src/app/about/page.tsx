import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/container";
import { CtaBanner } from "@/components/cta-banner";
import { PageHeader } from "@/components/page-header";
import { getSiteConfig } from "@/lib/content";

export const metadata: Metadata = {
  title: "소개",
  description: "천천히, 오래 쓰는 물건을 만드는 공방의 이야기를 소개합니다.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  { title: "손으로, 한 점씩", description: "모든 제품은 공방에서 직접 성형하고 마감합니다." },
  { title: "오래 쓰는 소재", description: "매일 써도 안심할 수 있는 무연 유약, 천연 소재를 고릅니다." },
  { title: "솔직한 안내", description: "수작업 특성과 제작 기간을 숨김없이 미리 알려 드립니다." },
];

export default function AboutPage() {
  const site = getSiteConfig();
  return (
    <>
      <PageHeader title="소개" description={`${site.name}은 ${site.tagline}을 만드는 작은 공방입니다.`} />
      <Container className="mt-12 grid items-center gap-10 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
          <Image src="/images/about.svg" alt="공방 작업 공간" fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="space-y-4 text-lg leading-relaxed text-navy-700">
          <h2 className="text-2xl font-bold text-navy-900">천천히 만들어 오래 곁에 두는 물건</h2>
          <p>
            빠르게 만들고 쉽게 버려지는 물건 대신, 손에 익을수록 정이 드는 물건을 만들고 싶었습니다. 흙을
            고르고, 빚고, 굽는 모든 과정을 공방에서 직접 합니다.
          </p>
          <p>
            클래스에서는 그 과정을 함께 나눕니다. 처음 흙을 만지는 분도 자신만의 그릇을 완성하는 순간을
            경험할 수 있도록 곁에서 돕겠습니다.
          </p>
        </div>
      </Container>

      <section aria-labelledby="values-title" className="mt-20">
        <Container>
          <h2 id="values-title" className="text-2xl font-bold text-navy-900">
            우리가 지키는 것
          </h2>
          <ul className="mt-6 grid gap-6 md:grid-cols-3">
            {VALUES.map((value) => (
              <li key={value.title} className="rounded-2xl bg-white p-6 ring-1 ring-beige-200">
                <h3 className="text-lg font-bold text-navy-900">{value.title}</h3>
                <p className="mt-2 text-navy-700">{value.description}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
