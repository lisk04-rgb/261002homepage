"use client";

import type { User } from "firebase/auth";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { isFirebaseEnabled } from "@/lib/firebase/config";

// Firebase 인증 코드는 용량이 커서 첫 화면이 뜬 뒤에 따로 불러온다.
const loadAuth = () => import("@/lib/firebase/auth");

type AuthContextValue = {
  enabled: boolean;
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isFirebaseEnabled);

  useEffect(() => {
    if (!isFirebaseEnabled) return;
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;
    loadAuth().then(({ watchAuth }) => {
      if (cancelled) return;
      unsubscribe = watchAuth((nextUser) => {
        setUser(nextUser);
        setLoading(false);
      });
    });
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  const signIn = useCallback(async () => {
    if (!isFirebaseEnabled) return;
    try {
      const { signInWithGoogle } = await loadAuth();
      await signInWithGoogle();
    } catch (error) {
      const code = (error as { code?: string }).code;
      // 사용자가 팝업을 닫은 경우는 오류로 보지 않는다.
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") return;
      if (code === "auth/popup-blocked") {
        alert("팝업이 차단되었어요. 브라우저 주소창에서 팝업을 허용한 뒤 다시 시도해 주세요.");
        return;
      }
      alert("로그인 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.");
      console.error(error);
    }
  }, []);

  const signOutUser = useCallback(async () => {
    if (!isFirebaseEnabled) return;
    const { signOutFirebase } = await loadAuth();
    await signOutFirebase();
  }, []);

  const value = useMemo(
    () => ({ enabled: isFirebaseEnabled, user, loading, signIn, signOutUser }),
    [user, loading, signIn, signOutUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth는 AuthProvider 안에서만 쓸 수 있어요.");
  return context;
}
