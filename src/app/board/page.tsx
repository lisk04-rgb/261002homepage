import type { Metadata } from "next";
import { BoardList } from "@/components/board-list";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "게시판",
  description: "후기, 질문, 팁을 자유롭게 나누는 소통 공간입니다.",
  alternates: { canonical: "/board" },
};

export default function BoardPage() {
  return (
    <>
      <PageHeader title="게시판" description="후기, 질문, 팁을 자유롭게 나눠 보세요. 글쓰기와 댓글은 로그인 후 가능해요." />
      <Container className="mt-10">
        <BoardList />
      </Container>
    </>
  );
}
