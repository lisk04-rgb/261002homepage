"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { LoginPrompt } from "@/components/login-prompt";
import { PostForm } from "@/components/post-form";

export function NewPost() {
  const { enabled, user, loading } = useAuth();
  const router = useRouter();

  if (!enabled) return <p className="text-navy-700">게시판이 아직 준비 중이에요.</p>;
  if (loading) return <p role="status" className="text-navy-700">불러오는 중…</p>;
  if (!user) return <LoginPrompt message="글쓰기는 로그인한 회원만 할 수 있어요." />;

  return (
    <PostForm
      submitLabel="등록"
      onSubmit={async (input) => {
        const { createPost } = await import("@/lib/firebase/board");
        const id = await createPost({ uid: user.uid, displayName: user.displayName }, input);
        router.push(`/board/post?id=${id}`);
      }}
    />
  );
}
