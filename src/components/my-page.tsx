"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { ButtonLink } from "@/components/button-link";
import { Container } from "@/components/container";
import { ItemCard } from "@/components/item-card";
import { formatDate } from "@/lib/format";
import { deleteReview, fetchMyReviews, type MemberReview, type MemberReviewStatus } from "@/lib/firebase/reviews";
import { subscribeWishlist, type ItemKey } from "@/lib/firebase/wishlist";
import type { CatalogSummary } from "@/types/content";

const STATUS_LABELS: Record<MemberReviewStatus, string> = {
  pending: "검토 중",
  approved: "공개됨",
  rejected: "비공개",
};

export function MyPage({ items }: { items: CatalogSummary[] }) {
  const { enabled, user, loading, signIn, signOutUser } = useAuth();
  const [wishlist, setWishlist] = useState<Set<ItemKey>>(new Set());
  const [reviews, setReviews] = useState<MemberReview[] | null>(null);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeWishlist(user.uid, setWishlist);
    fetchMyReviews(user.uid)
      .then(setReviews)
      .catch((error) => {
        console.error(error);
        setReviews([]);
      });
    return unsubscribe;
  }, [user]);

  if (!enabled) {
    return (
      <Container className="mt-10">
        <p className="text-navy-700">회원 기능이 아직 준비 중이에요.</p>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="mt-10">
        <p className="text-navy-700" role="status">
          불러오는 중…
        </p>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="mt-10">
        <div className="max-w-md rounded-2xl bg-white p-8 ring-1 ring-beige-200">
          <p className="text-navy-700">로그인하면 찜한 상품과 내가 쓴 후기를 볼 수 있어요.</p>
          <button
            type="button"
            onClick={signIn}
            className="mt-6 min-h-11 w-full rounded-full bg-navy-900 px-5 font-semibold text-white hover:bg-navy-700"
          >
            구글로 로그인
          </button>
        </div>
      </Container>
    );
  }

  const savedItems = items.filter((item) => wishlist.has(`${item.kind}/${item.slug}`));
  const titleOf = (key: string) => items.find((item) => `${item.kind}/${item.slug}` === key)?.title ?? key;

  const onDelete = async (id: string) => {
    if (!confirm("이 후기를 삭제할까요?")) return;
    try {
      await deleteReview(id);
      setReviews((current) => current?.filter((review) => review.id !== id) ?? null);
    } catch (error) {
      console.error(error);
      alert("삭제하지 못했어요. 잠시 후 다시 시도해 주세요.");
    }
  };

  return (
    <Container className="mt-10 space-y-16">
      <section aria-labelledby="profile-title" className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="profile-title" className="text-xl font-bold text-navy-900">
            {user.displayName ?? "회원"}님, 반가워요
          </h2>
          <p className="text-navy-700">{user.email}</p>
        </div>
        <button
          type="button"
          onClick={signOutUser}
          className="min-h-11 self-start rounded-full border border-navy-900 px-5 font-semibold text-navy-900 hover:bg-navy-900 hover:text-white"
        >
          로그아웃
        </button>
      </section>

      <section aria-labelledby="wishlist-title">
        <h2 id="wishlist-title" className="text-2xl font-bold text-navy-900">
          찜 목록 <span className="text-navy-500">{savedItems.length}</span>
        </h2>
        {savedItems.length > 0 ? (
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {savedItems.map((item) => (
              <li key={`${item.kind}-${item.slug}`}>
                <ItemCard item={item} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-4 rounded-xl bg-beige-100 p-8 text-center">
            <p className="text-navy-700">아직 찜한 항목이 없어요. 상세 페이지에서 ♡ 찜하기를 눌러 보세요.</p>
            <ButtonLink href="/products" className="mt-4">
              상품 둘러보기
            </ButtonLink>
          </div>
        )}
      </section>

      <section aria-labelledby="my-reviews-title">
        <h2 id="my-reviews-title" className="text-2xl font-bold text-navy-900">
          내가 쓴 후기
        </h2>
        {reviews === null ? (
          <p className="mt-4 text-navy-700" role="status">
            불러오는 중…
          </p>
        ) : reviews.length > 0 ? (
          <ul className="mt-6 space-y-4">
            {reviews.map((review) => (
              <li key={review.id} className="rounded-2xl bg-white p-5 ring-1 ring-beige-200">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-navy-900">{titleOf(review.target)}</p>
                  <span className="rounded-full bg-beige-100 px-3 py-1 text-sm text-navy-700">
                    {STATUS_LABELS[review.status] ?? review.status}
                  </span>
                </div>
                <p className="mt-1 text-terracotta-600">
                  <span role="img" aria-label={`별점 ${review.rating}점`}>
                    <span aria-hidden="true">{"★".repeat(review.rating)}</span>
                  </span>
                </p>
                <p className="mt-2 text-navy-700">{review.content}</p>
                <div className="mt-3 flex items-center justify-between text-sm text-navy-500">
                  <time dateTime={review.date}>{formatDate(review.date)}</time>
                  <button type="button" onClick={() => onDelete(review.id)} className="min-h-11 px-2 underline hover:text-navy-900">
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-navy-700">아직 남긴 후기가 없어요.</p>
        )}
      </section>
    </Container>
  );
}
