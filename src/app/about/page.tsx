import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/container";
import { CtaBanner } from "@/components/cta-banner";
import { PageHeader } from "@/components/page-header";
import { getSiteConfig } from "@/lib/content";

export const metadata: Metadata = {
  title: "소개",
  description: "내집마련을 순서대로 준비할 수 있도록 돕는 컨설팅·코칭을 소개합니다.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  { title: "내 상황부터", description: "소득, 자금, 목표 시점이 사람마다 달라서 먼저 내 상황을 정리합니다." },
  { title: "직접 해 보는 과제", description: "듣고 끝나지 않도록 매주 과제로 계획을 직접 완성합니다." },
  { title: "솔직한 안내", description: "수익을 보장하지 않으며, 판단 기준과 위험을 함께 설명합니다." },
];

export default function AboutPage() {
  const site = getSiteConfig();
  return (
    <>
      <PageHeader title="소개" description={`${site.name}은 ${site.tagline}를 목표로 합니다.`} />
      <Container className="mt-12 grid items-center gap-10 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
          <Image src="/images/about.svg" alt="코치 소개 이미지 자리" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="space-y-4 text-lg leading-relaxed text-navy-700">
          <h2 className="text-2xl font-bold text-navy-900">막막함을 순서로 바꾸는 일</h2>
          <p>
            내 집 마련은 정보가 너무 많아서 오히려 시작하기 어렵습니다. 무엇을 먼저 확인해야 하는지,
            어디까지 준비되었는지를 함께 정리하면 다음 행동이 보입니다.
          </p>
          <p>
            1대1 컨설팅으로 내 상황을 점검하고, 4주 코칭으로 계획을 직접 완성해 보세요.
            (이 소개글은 예시이니 실제 경력과 이야기로 바꿔 주세요.)
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
