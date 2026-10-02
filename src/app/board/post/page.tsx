import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { PostView } from "@/components/post-view";

export const metadata: Metadata = { title: "게시글", robots: { index: false, follow: false } };

// 글은 로그인 없이도 읽지만 내용이 브라우저에서 불러와지므로 검색엔진 대상에서는 뺀다.
export default function PostPage() {
  return (
    <>
      <PageHeader title="게시판" />
      <Container className="mt-10 max-w-3xl">
        <Suspense fallback={<p className="text-navy-700">불러오는 중…</p>}>
          <PostView />
        </Suspense>
      </Container>
    </>
  );
}
