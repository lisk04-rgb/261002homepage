import { ButtonLink } from "@/components/button-link";
import { Container } from "@/components/container";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="font-semibold text-terracotta-700">404</p>
      <h1 className="mt-2 text-3xl font-bold text-navy-900">페이지를 찾을 수 없어요</h1>
      <p className="mt-3 text-navy-700">주소가 바뀌었거나 삭제된 페이지일 수 있어요.</p>
      <div className="mt-8">
        <ButtonLink href="/">홈으로 가기</ButtonLink>
      </div>
    </Container>
  );
}
