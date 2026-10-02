"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import type { ItemKey } from "@/lib/firebase/wishlist";

const loadWishlist = () => import("@/lib/firebase/wishlist");

export function WishlistButton({ itemKey, title }: { itemKey: ItemKey; title: string }) {
  const { enabled, user, signIn } = useAuth();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) {
      setSaved(false);
      return;
    }
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;
    loadWishlist().then(({ subscribeWishlist }) => {
      if (!cancelled) unsubscribe = subscribeWishlist(user.uid, (keys) => setSaved(keys.has(itemKey)));
    });
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [user, itemKey]);

  if (!enabled) return null;

  const toggle = async () => {
    if (!user) {
      await signIn();
      return;
    }
    setBusy(true);
    try {
      const { addToWishlist, removeFromWishlist } = await loadWishlist();
      await (saved ? removeFromWishlist(user.uid, itemKey) : addToWishlist(user.uid, itemKey));
    } catch (error) {
      console.error(error);
      alert("찜 목록을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={saved}
      aria-label={saved ? `${title} 찜 해제` : `${title} 찜하기`}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-beige-300 bg-white px-5 font-semibold text-navy-900 transition-colors hover:border-terracotta-600 disabled:opacity-60"
    >
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" className={saved ? "fill-terracotta-600 stroke-terracotta-600" : "fill-none stroke-current"} strokeWidth="2">
        <path d="M12 21s-7.5-4.6-9.5-9.3C1.2 8.4 3.3 5 6.7 5c2 0 3.6 1.1 4.3 2.6h2C13.7 6.1 15.3 5 17.3 5c3.4 0 5.5 3.4 4.2 6.7C19.5 16.4 12 21 12 21z" />
      </svg>
      {saved ? "찜함" : "찜하기"}
    </button>
  );
}
