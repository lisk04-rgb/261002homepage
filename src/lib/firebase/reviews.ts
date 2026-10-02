import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  where,
} from "firebase/firestore";
import { getDb } from "@/lib/firebase/db";
import type { ItemKey } from "@/lib/firebase/wishlist";
import { maskName, type MemberReviewInput } from "@/lib/member-review";

export type MemberReviewStatus = "pending" | "approved" | "rejected";

export type MemberReview = {
  id: string;
  uid: string;
  name: string;
  rating: number;
  content: string;
  target: ItemKey;
  status: MemberReviewStatus;
  /** YYYY-MM-DD */
  date: string;
};

const toDate = (value: unknown) =>
  value instanceof Timestamp ? value.toDate().toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);

async function fetchReviews(constraints: ReturnType<typeof where>[]): Promise<MemberReview[]> {
  // 정렬은 클라이언트에서 해서 Firestore 복합 색인을 따로 만들 필요가 없게 한다.
  const snapshot = await getDocs(query(collection(getDb(), "reviews"), ...constraints));
  return snapshot.docs
    .map((item) => {
      const data = item.data();
      return {
        id: item.id,
        uid: data.uid,
        name: data.name,
        rating: data.rating,
        content: data.content,
        target: data.target,
        status: data.status,
        date: toDate(data.createdAt),
      } as MemberReview;
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function fetchApprovedReviews(target: ItemKey) {
  return fetchReviews([where("target", "==", target), where("status", "==", "approved")]);
}

export function fetchMyReviews(uid: string) {
  return fetchReviews([where("uid", "==", uid)]);
}

export function createReview(
  user: { uid: string; displayName: string | null },
  target: ItemKey,
  input: MemberReviewInput,
) {
  return addDoc(collection(getDb(), "reviews"), {
    uid: user.uid,
    name: maskName(user.displayName),
    rating: input.rating,
    content: input.content,
    target,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}

export function deleteReview(id: string) {
  return deleteDoc(doc(getDb(), "reviews", id));
}
