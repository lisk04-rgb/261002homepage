"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useAuth } from "@/components/auth-provider";
import { ReviewCard } from "@/components/review-card";
import { StarRatingInput } from "@/components/star-rating-input";
import type { MemberReview } from "@/lib/firebase/reviews";
import type { ItemKey } from "@/lib/firebase/wishlist";
import { REVIEW_MAX_LENGTH, memberReviewInputSchema } from "@/lib/member-review";
import type { Review } from "@/types/content";

const loadReviews = () => import("@/lib/firebase/reviews");

type ReviewSectionProps = { itemKey: ItemKey; staticReviews: Review[] };

export function ReviewSection({ itemKey, staticReviews }: ReviewSectionProps) {
  const { enabled, user, signIn } = useAuth();
  const [memberReviews, setMemberReviews] = useState<MemberReview[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  // 후기 영역이 화면 가까이 왔을 때만 Firestore를 불러와 첫 화면 속도를 지킨다.
  useEffect(() => {
    const element = sectionRef.current;
    if (!enabled || !element) return;
    let cancelled = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        loadReviews()
          .then(({ fetchApprovedReviews }) => fetchApprovedReviews(itemKey))
          .then((result) => !cancelled && setMemberReviews(result))
          .catch((error) => console.error("후기를 불러오지 못했어요.", error));
      },
      { rootMargin: "400px" },
    );
    observer.observe(element);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [enabled, itemKey]);

  const reviews = [
    ...memberReviews.map((review) => ({ ...review, featured: false })),
    ...staticReviews,
  ].sort((a, b) => b.date.localeCompare(a.date));

  if (!enabled && reviews.length === 0) return null;

  return (
    <section ref={sectionRef} aria-labelledby="reviews-title">
      <h2 id="reviews-title" className="text-2xl font-bold text-navy-900">
        후기 <span className="text-navy-500">{reviews.length}</span>
      </h2>

      {reviews.length > 0 ? (
        <ul className="mt-6 grid gap-6 md:grid-cols-2">
          {reviews.map((review) => (
            <li key={review.id}>
              <ReviewCard review={review} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-navy-700">아직 후기가 없어요. 첫 후기를 남겨 주세요.</p>
      )}

      {enabled && (
        <div className="mt-8 max-w-2xl rounded-2xl bg-beige-100 p-6">
          {user ? (
            <ReviewForm itemKey={itemKey} user={{ uid: user.uid, displayName: user.displayName }} />
          ) : (
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-navy-700">후기는 로그인한 회원만 남길 수 있어요.</p>
              <button
                type="button"
                onClick={signIn}
                className="min-h-11 rounded-full bg-navy-900 px-5 font-semibold text-white hover:bg-navy-700"
              >
                구글로 로그인
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function ReviewForm({ itemKey, user }: { itemKey: ItemKey; user: { uid: string; displayName: string | null } }) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const parsed = memberReviewInputSchema.safeParse({ rating, content });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "입력값을 확인해 주세요.");
      return;
    }
    setError("");
    setStatus("submitting");
    try {
      const { createReview } = await loadReviews();
      await createReview(user, itemKey, parsed.data);
      setStatus("done");
      setRating(0);
      setContent("");
    } catch (submitError) {
      console.error(submitError);
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <p role="status" className="text-navy-900">
        후기가 접수되었어요. 확인 후 공개되며, <Link href="/mypage" className="underline">마이페이지</Link>에서 상태를 볼 수 있어요.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <h3 className="text-lg font-bold text-navy-900">후기 남기기</h3>
      <StarRatingInput value={rating} onChange={setRating} />
      <div>
        <label htmlFor="review-content" className="text-sm font-medium text-navy-900">
          내용
        </label>
        <textarea
          id="review-content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          maxLength={REVIEW_MAX_LENGTH}
          rows={4}
          aria-describedby="review-help"
          className="mt-1 block w-full rounded-lg border border-beige-300 bg-white p-3 text-navy-900"
        />
        <p id="review-help" className="mt-1 text-sm text-navy-500">
          {content.length}/{REVIEW_MAX_LENGTH}자 · 이름은 가운데를 가려서 공개돼요.
        </p>
      </div>
      {error && (
        <p role="alert" className="text-sm font-medium text-terracotta-700">
          {error}
        </p>
      )}
      {status === "error" && (
        <p role="alert" className="text-sm font-medium text-terracotta-700">
          후기를 저장하지 못했어요. 잠시 후 다시 시도해 주세요.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="min-h-11 rounded-full bg-terracotta-600 px-6 font-semibold text-white hover:bg-terracotta-700 disabled:opacity-60"
      >
        {status === "submitting" ? "등록 중…" : "후기 등록"}
      </button>
    </form>
  );
}
