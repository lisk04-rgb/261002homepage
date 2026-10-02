"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth-provider";

/** 헤더용 로그인/마이페이지 링크. Firebase 설정이 없으면 아무것도 보이지 않는다. */
export function AuthButton({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const { enabled, user, loading, signIn } = useAuth();
  if (!enabled) return null;

  const base =
    variant === "desktop"
      ? "font-medium text-navy-700 hover:text-navy-900"
      : "block w-full py-3 text-left text-lg font-medium text-navy-900";

  // 로그인 상태 확인 전에는 자리만 잡아 레이아웃이 흔들리지 않게 한다.
  if (loading) return <span className={`${base} invisible`} aria-hidden="true">로그인</span>;

  if (user) {
    return (
      <Link href="/mypage" className={base}>
        마이페이지
      </Link>
    );
  }
  return (
    <button type="button" onClick={signIn} className={base}>
      로그인
    </button>
  );
}
