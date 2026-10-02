"use client";

import { useAuth } from "@/components/auth-provider";

export function LoginPrompt({ message }: { message: string }) {
  const { signIn } = useAuth();
  return (
    <div className="flex flex-col items-start gap-3 rounded-2xl bg-beige-100 p-6 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-navy-700">{message}</p>
      <button
        type="button"
        onClick={signIn}
        className="min-h-11 rounded-full bg-navy-900 px-5 font-semibold text-white hover:bg-navy-700"
      >
        구글로 로그인
      </button>
    </div>
  );
}
