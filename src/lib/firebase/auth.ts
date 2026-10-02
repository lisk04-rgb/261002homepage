import {
  browserLocalPersistence,
  browserPopupRedirectResolver,
  getAuth,
  GoogleAuthProvider,
  indexedDBLocalPersistence,
  initializeAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type Auth,
  type User,
} from "firebase/auth";
import { getFirebaseApp } from "@/lib/firebase/config";

let auth: Auth | undefined;

// getAuth()는 첫 화면에서 구글 팝업용 스크립트까지 받아 느려지므로,
// 팝업 처리기는 로그인 버튼을 누를 때만 넘긴다.
function getFirebaseAuth(): Auth {
  if (!auth) {
    try {
      auth = initializeAuth(getFirebaseApp(), {
        persistence: [indexedDBLocalPersistence, browserLocalPersistence],
      });
    } catch {
      auth = getAuth(getFirebaseApp());
    }
  }
  return auth;
}

export function watchAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(getFirebaseAuth(), callback);
}

export function signInWithGoogle() {
  return signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider(), browserPopupRedirectResolver);
}

export function signOutFirebase() {
  return signOut(getFirebaseAuth());
}
