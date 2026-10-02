import { ButtonLink } from "@/components/button-link";
import { Container } from "@/components/container";

export function CtaBanner({
  title = "궁금한 점이 있으신가요?",
  description = "내 상황에 어떤 서비스가 맞는지 편하게 물어보세요. 영업일 기준 하루 안에 답변드려요.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section aria-labelledby="cta-title" className="mt-24">
      <Container>
        <div className="rounded-3xl bg-navy-900 px-6 py-12 text-center sm:px-12">
          <h2 id="cta-title" className="text-2xl font-bold text-white sm:text-3xl">
            {title}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-beige-100">{description}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/contact" variant="primary">
              문의하기
            </ButtonLink>
            <ButtonLink href="/services" variant="light">
              서비스 둘러보기
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
