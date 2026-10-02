"use client";

import Link from "next/link";
import type { QueryDocumentSnapshot } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { ButtonLink } from "@/components/button-link";
import { formatDate } from "@/lib/format";
import type { Post } from "@/lib/firebase/board";

const loadBoard = () => import("@/lib/firebase/board");

export function BoardList() {
  const { enabled } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [cursor, setCursor] = useState<QueryDocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  const loadMore = useCallback(async (after: QueryDocumentSnapshot | null) => {
    try {
      const { fetchPosts } = await loadBoard();
      const page = await fetchPosts(after);
      setPosts((current) => (after ? [...current, ...page.posts] : page.posts));
      setCursor(page.cursor);
      setHasMore(page.hasMore);
      setStatus("ready");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (enabled) void loadMore(null);
  }, [enabled, loadMore]);

  if (!enabled) return <p className="text-navy-700">게시판이 아직 준비 중이에요.</p>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-navy-700" aria-live="polite">
          {status === "ready" ? `글 ${posts.length}${hasMore ? "+" : ""}개` : " "}
        </p>
        <ButtonLink href="/board/new">글쓰기</ButtonLink>
      </div>

      {status === "loading" && (
        <p className="mt-8 text-navy-700" role="status">
          불러오는 중…
        </p>
      )}
      {status === "error" && (
        <p role="alert" className="mt-8 rounded-xl bg-beige-100 p-6 text-navy-700">
          글을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
        </p>
      )}
      {status === "ready" && posts.length === 0 && (
        <p className="mt-8 rounded-xl bg-beige-100 p-8 text-center text-navy-700">
          아직 글이 없어요. 첫 글을 남겨 주세요.
        </p>
      )}

      {posts.length > 0 && (
        <ul className="mt-4 divide-y divide-beige-200 overflow-hidden rounded-2xl bg-white ring-1 ring-beige-200">
          {posts.map((post) => (
            <li key={post.id}>
              <Link href={`/board/post?id=${post.id}`} className="block px-5 py-4 hover:bg-beige-50">
                <p className="font-semibold text-navy-900">{post.title}</p>
                <p className="mt-1 line-clamp-1 text-sm text-navy-700">{post.content}</p>
                <p className="mt-2 text-sm text-navy-500">
                  {post.name} · <time dateTime={post.date}>{formatDate(post.date)}</time>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {hasMore && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => loadMore(cursor)}
            className="min-h-11 rounded-full border border-navy-900 px-6 font-semibold text-navy-900 hover:bg-navy-900 hover:text-white"
          >
            더보기
          </button>
        </div>
      )}
    </div>
  );
}
