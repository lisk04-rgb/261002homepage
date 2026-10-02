import { addDoc, collection, getDocs, query, serverTimestamp, Timestamp, where } from "firebase/firestore";
import type { AssignmentInput } from "@/lib/assignment";
import { getDb } from "@/lib/firebase/db";
import { maskName } from "@/lib/member-review";

export type Submission = {
  id: string;
  program: string;
  week: number;
  title: string;
  content: string;
  link?: string;
  /** 관리자가 Firebase 콘솔에서 적는 피드백 */
  feedback?: string;
  /** YYYY-MM-DD */
  date: string;
};

const toDate = (value: unknown) =>
  (value instanceof Timestamp ? value.toDate() : new Date()).toISOString().slice(0, 10);

export function createSubmission(user: { uid: string; displayName: string | null }, input: AssignmentInput) {
  return addDoc(collection(getDb(), "submissions"), {
    uid: user.uid,
    // 관리자가 누구의 제출인지 알 수 있도록 실명 대신 마스킹 이름 + uid를 함께 저장한다.
    name: maskName(user.displayName),
    program: input.program,
    week: input.week,
    title: input.title,
    content: input.content,
    ...(input.link ? { link: input.link } : {}),
    createdAt: serverTimestamp(),
  });
}

export async function fetchMySubmissions(uid: string): Promise<Submission[]> {
  // 정렬은 클라이언트에서 해서 복합 색인 없이 동작하게 한다.
  const snapshot = await getDocs(query(collection(getDb(), "submissions"), where("uid", "==", uid)));
  return snapshot.docs
    .map((item) => {
      const data = item.data();
      return {
        id: item.id,
        program: data.program,
        week: data.week,
        title: data.title,
        content: data.content,
        link: data.link,
        feedback: data.feedback,
        date: toDate(data.createdAt),
      } as Submission;
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}
