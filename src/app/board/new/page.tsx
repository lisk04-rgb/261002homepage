import type { Metadata } from "next";
import { Container } from "@/components/container";
import { NewPost } from "@/components/new-post";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = { title: "글쓰기", robots: { index: false, follow: false } };

export default function NewPostPage() {
  return (
    <>
      <PageHeader title="글쓰기" />
      <Container className="mt-10 max-w-3xl">
        <NewPost />
      </Container>
    </>
  );
}
