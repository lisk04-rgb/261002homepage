import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";

// NEXT_PUBLIC_ 값은 빌드 때 코드에 그대로 박히므로 하나씩 직접 참조해야 한다.
// Firebase 웹 설정값은 공개용 식별자라 브라우저에 노출돼도 되고, 보안은 firestore.rules가 담당한다.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/** 필수 환경변수가 없으면 Firebase 기능을 숨기고 나머지 사이트는 그대로 동작하게 한다. */
export const isFirebaseEnabled = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId,
);

export const measurementId = firebaseConfig.measurementId;

export function getFirebaseApp(): FirebaseApp {
  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}
