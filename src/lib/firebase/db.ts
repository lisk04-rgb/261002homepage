import { getFirestore, type Firestore } from "firebase/firestore";
import { getFirebaseApp } from "@/lib/firebase/config";

export function getDb(): Firestore {
  return getFirestore(getFirebaseApp());
}
