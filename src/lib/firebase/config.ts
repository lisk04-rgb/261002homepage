import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";

// Firebase 웹 설정값은 공개용 식별자라 코드에 있어도 안전하다(보안은 firestore.rules가 담당).
// 환경변수 없이도 동작하도록 기본값을 넣었고, NEXT_PUBLIC_FIREBASE_* 환경변수가 있으면 그 값이 우선한다.
// NEXT_PUBLIC_ 값은 빌드 때 코드에 박히므로 process.env를 하나씩 직접 참조해야 한다.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDeBx1CknGlIooyq62Ngdr3olgIOoC-nnc",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "challenge-eed68.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "challenge-eed68",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "challenge-eed68.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "55084304329",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:55084304329:web:bcaefd50588f5d5ec58a18",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-XB9G37HXR9",
};

/** 필수 환경변수가 없으면 Firebase 기능을 숨기고 나머지 사이트는 그대로 동작하게 한다. */
export const isFirebaseEnabled = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId,
);

export const measurementId = firebaseConfig.measurementId;

export function getFirebaseApp(): FirebaseApp {
  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}
