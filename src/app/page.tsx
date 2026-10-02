import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/button-link";
import { Container } from "@/components/container";
import { CtaBanner } from "@/components/cta-banner";
import { ItemCard } from "@/components/item-card";
import { ReviewCard } from "@/components/review-card";
import { SectionHeading } from "@/components/section-heading";
import { UpcomingEvents } from "@/components/upcoming-events";
import { toSummary } from "@/lib/catalog";
import { getEvents, getProducts, getReviews, getServices, getSiteConfig } from "@/lib/content";

const STEPS = [
  { title: "상담 신청", description: "문의 폼이나 카카오톡으로 내 상황과 궁금한 점을 남겨 주세요." },
  { title: "현황 점검과 목표 설정", description: "소득·자금·목표 시점을 함께 정리하고 나에게 맞는 서비스를 안내해 드려요." },
  { title: "실행과 피드백", description: "코칭 기간에는 매주 과제를 제출하고 피드백을 받으며 계획을 완성해요." },
];

export default function HomePage() {
  const site = getSiteConfig();
  const products = getProducts();
  const services = getServices();
  const featured = [...products, ...services].filter((item) => item.featured).map(toSummary);
  const titles = new Map([...products, ...services].map((item) => [`${item.kind}/${item.slug}`, item.title]));
  const events = getEvents();
  const reviews = getReviews()
    .filter((review) => review.featured)
    .slice(0, 3);

  return (
    <>
      <section aria-labelledby="hero-title" className="bg-beige-100">
        <Container className="grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-2">
          <div>
            <p className="font-semibold text-terracotta-700">{site.hero.eyebrow}</p>
            <h1 id="hero-title" className="mt-3 text-4xl leading-tight font-bold whitespace-pre-line text-navy-900 sm:text-5xl">
              {site.hero.title}
            </h1>
            <p className="mt-5 max-w-lg text-lg text-navy-700">{site.hero.subtitle}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/services">서비스 둘러보기</ButtonLink>
              <ButtonLink href="/contact" variant="secondary">
                문의하기
              </ButtonLink>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src="/images/hero.svg"
              alt={`${site.name} 대표 이미지`}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Container>
      </section>

      <section aria-labelledby="featured-title" className="mt-20">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading id="featured-title" eyebrow="서비스" title="내 상황에 맞는 방법을 골라 보세요" />
            <div className="flex gap-4 text-sm font-semibold">
              {products.length > 0 && (
                <Link href="/products" className="text-terracotta-700 hover:underline">
                  상품 전체 보기 →
                </Link>
              )}
              <Link href="/services" className="text-terracotta-700 hover:underline">
                서비스 전체 보기 →
              </Link>
            </div>
          </div>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((item) => (
              <li key={`${item.kind}-${item.slug}`}>
                <ItemCard item={item} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <UpcomingEvents events={events} />

      <section aria-labelledby="steps-title" className="mt-24">
        <Container>
          <SectionHeading id="steps-title" eyebrow="이용 방법" title="세 단계면 충분해요" align="center" />
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step.title} className="rounded-2xl bg-white p-6 ring-1 ring-beige-200">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 font-bold text-white" aria-hidden="true">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-lg font-bold text-navy-900">
                  <span className="sr-only">{index + 1}단계: </span>
                  {step.title}
                </h3>
                <p className="mt-2 text-navy-700">{step.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {reviews.length > 0 && (
        <section aria-labelledby="reviews-title" className="mt-24">
          <Container>
            <SectionHeading id="reviews-title" eyebrow="후기" title="먼저 경험한 분들의 이야기" />
            <ul className="mt-8 grid gap-6 md:grid-cols-3">
              {reviews.map((review) => (
                <li key={review.id}>
                  <ReviewCard review={review} targetTitle={review.target ? titles.get(review.target) : undefined} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <CtaBanner />
    </>
  );
}
