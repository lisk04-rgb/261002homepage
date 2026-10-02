import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { getDb } from "@/lib/firebase/db";
import type { CatalogKind } from "@/types/content";

/** 찜 항목 키. 예: "products/ceramic-mug" (리뷰 target과 같은 형식) */
export type ItemKey = `${CatalogKind}/${string}`;

// 문서 ID에는 /를 쓸 수 없어 __로 바꾼다.
const toDocId = (key: ItemKey) => key.replace("/", "__");

export function subscribeWishlist(uid: string, onChange: (keys: Set<ItemKey>) => void): Unsubscribe {
  return onSnapshot(collection(getDb(), "users", uid, "wishlist"), (snapshot) => {
    onChange(new Set(snapshot.docs.map((item) => item.data().key as ItemKey)));
  });
}

export function addToWishlist(uid: string, key: ItemKey) {
  return setDoc(doc(getDb(), "users", uid, "wishlist", toDocId(key)), {
    key,
    createdAt: serverTimestamp(),
  });
}

export function removeFromWishlist(uid: string, key: ItemKey) {
  return deleteDoc(doc(getDb(), "users", uid, "wishlist", toDocId(key)));
}
