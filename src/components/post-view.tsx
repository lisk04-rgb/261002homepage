"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/components/auth-provider";
import { LoginPrompt } from "@/components/login-prompt";
import { PostForm } from "@/components/post-form";
import { COMMENT_MAX, commentInputSchema } from "@/lib/board";
import { formatDate } from "@/lib/format";
import type { BoardComment, Post } from "@/lib/firebase/board";

const loadBoard = () => import("@/lib/firebase/board");

export function PostView() {
  const id = useSearchParams().get("id");
  const router = useRouter();
  const { enabled, user } = useAuth();
  const [post, setPost] = useState<Post | null | undefined>(undefined);
  const [comments, setComments] = useState<BoardComment[]>([]);
  const [editing, setEditing] = useState(false);

  const refreshComments = useCallback(async () => {
    if (!id) return;
    const { fetchComments } = await loadBoard();
    setComments(await fetchComments(id));
  }, [id]);

  useEffect(() => {
    if (!enabled || !id) return;
    let cancelled = false;
    loadBoard()
      .then(async ({ fetchPost, fetchComments }) => {
        const [loadedPost, loadedComments] = await Promise.all([fetchPost(id), fetchComments(id)]);
        if (cancelled) return;
        setPost(loadedPost);
        setComments(loadedComments);
      })
      .catch((error) => {
        console.error(error);
        if (!cancelled) setPost(null);
      });
    return () => {
      cancelled = true;
    };
  }, [enabled, id]);

  if (!enabled) return <p className="text-navy-700">게시판이 아직 준비 중이에요.</p>;
  if (!id || post === null) {
    return (
      <div>
        <p className="text-navy-700">글을 찾을 수 없어요. 삭제되었거나 주소가 잘못되었을 수 있어요.</p>
        <Link href="/board" className="mt-4 inline-block font-semibold text-terracotta-700 underline">
          목록으로
        </Link>
      </div>
    );
  }
  if (post === undefined) return <p role="status" className="text-navy-700">불러오는 중…</p>;

  const isAuthor = user?.uid === post.uid;

  const onDeletePost = async () => {
    if (!confirm("이 글을 삭제할까요? 댓글도 함께 삭제돼요.")) return;
    try {
      const { deletePost } = await loadBoard();
      await deletePost(post.id);
      router.push("/board");
    } catch (error) {
      console.error(error);
      alert("삭제하지 못했어요. 잠시 후 다시 시도해 주세요.");
    }
  };

  const onDeleteComment = async (commentId: string) => {
    if (!confirm("이 댓글을 삭제할까요?")) return;
    try {
      const { deleteComment } = await loadBoard();
      await deleteComment(post.id, commentId);
      setComments((current) => current.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error(error);
      alert("삭제하지 못했어요. 잠시 후 다시 시도해 주세요.");
    }
  };

  return (
    <div className="space-y-12">
      <article>
        {editing ? (
          <PostForm
            initial={{ title: post.title, content: post.content }}
            submitLabel="수정 완료"
            onCancel={() => setEditing(false)}
            onSubmit={async (input) => {
              const { updatePost } = await loadBoard();
              await updatePost(post.id, input);
              setPost({ ...post, ...input, edited: true });
              setEditing(false);
            }}
          />
        ) : (
          <>
            <h2 className="text-2xl font-bold text-navy-900">{post.title}</h2>
            <p className="mt-2 text-sm text-navy-500">
              {post.name} · <time dateTime={post.date}>{formatDate(post.date)}</time>
              {post.edited && " · 수정됨"}
            </p>
            <div className="mt-6 text-navy-700 leading-relaxed break-words whitespace-pre-wrap">{post.content}</div>
            {isAuthor && (
              <div className="mt-6 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="min-h-11 rounded-full border border-navy-900 px-5 font-semibold text-navy-900 hover:bg-navy-900 hover:text-white"
                >
                  수정
                </button>
                <button
                  type="button"
                  onClick={onDeletePost}
                  className="min-h-11 rounded-full border border-terracotta-700 px-5 font-semibold text-terracotta-700 hover:bg-terracotta-700 hover:text-white"
                >
                  삭제
                </button>
              </div>
            )}
          </>
        )}
      </article>

      <section aria-labelledby="comments-title">
        <h2 id="comments-title" className="text-xl font-bold text-navy-900">
          댓글 <span className="text-navy-500">{comments.length}</span>
        </h2>
        {comments.length > 0 && (
          <ul className="mt-4 space-y-3">
            {comments.map((comment) => (
              <li key={comment.id} className="rounded-xl bg-white p-4 ring-1 ring-beige-200">
                <div className="flex items-center justify-between gap-2 text-sm text-navy-500">
                  <p>
                    <span className="font-semibold text-navy-900">{comment.name}</span> ·{" "}
                    <time dateTime={comment.date}>{formatDate(comment.date)}</time>
                  </p>
                  {(user?.uid === comment.uid || isAuthor) && (
                    <button
                      type="button"
                      onClick={() => onDeleteComment(comment.id)}
                      className="min-h-11 px-2 underline hover:text-navy-900"
                    >
                      삭제
                    </button>
                  )}
                </div>
                <p className="mt-1 break-words whitespace-pre-wrap text-navy-700">{comment.content}</p>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6">
          {user ? (
            <CommentForm
              onSubmit={async (content) => {
                const { createComment } = await loadBoard();
                await createComment(post.id, { uid: user.uid, displayName: user.displayName }, { content });
                await refreshComments();
              }}
            />
          ) : (
            <LoginPrompt message="댓글은 로그인한 회원만 남길 수 있어요." />
          )}
        </div>
      </section>

      <Link href="/board" className="inline-block font-semibold text-terracotta-700 underline">
        ← 목록으로
      </Link>
    </div>
  );
}

function CommentForm({ onSubmit }: { onSubmit: (content: string) => Promise<void> }) {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const parsed = commentInputSchema.safeParse({ content });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "입력값을 확인해 주세요.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await onSubmit(parsed.data.content);
      setContent("");
    } catch (submitError) {
      console.error(submitError);
      setError("댓글을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <label htmlFor="comment-content" className="text-sm font-medium text-navy-900">
        댓글 쓰기
      </label>
      <textarea
        id="comment-content"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        maxLength={COMMENT_MAX}
        rows={3}
        className="block w-full rounded-lg border border-beige-300 bg-white p-3 text-navy-900"
      />
      {error && (
        <p role="alert" className="text-sm font-medium text-terracotta-700">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="min-h-11 rounded-full bg-navy-900 px-6 font-semibold text-white hover:bg-navy-700 disabled:opacity-60"
      >
        {submitting ? "등록 중…" : "댓글 등록"}
      </button>
    </form>
  );
}
