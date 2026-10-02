import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  Timestamp,
  updateDoc,
  writeBatch,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { BOARD_PAGE_SIZE, type CommentInput, type PostInput } from "@/lib/board";
import { getDb } from "@/lib/firebase/db";
import { maskName } from "@/lib/member-review";

export type BoardAuthor = { uid: string; displayName: string | null };

export type Post = {
  id: string;
  uid: string;
  name: string;
  title: string;
  content: string;
  /** YYYY-MM-DD */
  date: string;
  edited: boolean;
};

export type BoardComment = {
  id: string;
  uid: string;
  name: string;
  content: string;
  date: string;
};

// 방금 쓴 글은 서버 시간이 확정되기 전까지 null이라 오늘 날짜로 대신 보여 준다.
const toDate = (value: unknown) =>
  (value instanceof Timestamp ? value.toDate() : new Date()).toISOString().slice(0, 10);

const toPost = (id: string, data: DocumentData): Post => ({
  id,
  uid: data.uid,
  name: data.name,
  title: data.title,
  content: data.content,
  date: toDate(data.createdAt),
  edited: Boolean(data.updatedAt),
});

export type PostPage = { posts: Post[]; cursor: QueryDocumentSnapshot | null; hasMore: boolean };

export async function fetchPosts(after: QueryDocumentSnapshot | null): Promise<PostPage> {
  const base = [collection(getDb(), "posts"), orderBy("createdAt", "desc")] as const;
  const snapshot = await getDocs(
    after
      ? query(...base, startAfter(after), limit(BOARD_PAGE_SIZE))
      : query(...base, limit(BOARD_PAGE_SIZE)),
  );
  return {
    posts: snapshot.docs.map((item) => toPost(item.id, item.data())),
    cursor: snapshot.docs.at(-1) ?? after,
    hasMore: snapshot.size === BOARD_PAGE_SIZE,
  };
}

export async function fetchPost(id: string): Promise<Post | null> {
  const snapshot = await getDoc(doc(getDb(), "posts", id));
  return snapshot.exists() ? toPost(snapshot.id, snapshot.data()) : null;
}

export async function createPost(author: BoardAuthor, input: PostInput): Promise<string> {
  const ref = await addDoc(collection(getDb(), "posts"), {
    uid: author.uid,
    name: maskName(author.displayName),
    title: input.title,
    content: input.content,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export function updatePost(id: string, input: PostInput) {
  return updateDoc(doc(getDb(), "posts", id), {
    title: input.title,
    content: input.content,
    updatedAt: serverTimestamp(),
  });
}

/** 댓글을 먼저 지워야 한다(글이 사라지면 글쓴이 권한 확인이 불가능해짐). */
export async function deletePost(id: string) {
  const commentsRef = collection(getDb(), "posts", id, "comments");
  const comments = await getDocs(commentsRef);
  for (let start = 0; start < comments.docs.length; start += 400) {
    const batch = writeBatch(getDb());
    comments.docs.slice(start, start + 400).forEach((item) => batch.delete(item.ref));
    await batch.commit();
  }
  await deleteDoc(doc(getDb(), "posts", id));
}

export async function fetchComments(postId: string): Promise<BoardComment[]> {
  const snapshot = await getDocs(
    query(collection(getDb(), "posts", postId, "comments"), orderBy("createdAt", "asc"), limit(200)),
  );
  return snapshot.docs.map((item) => {
    const data = item.data();
    return { id: item.id, uid: data.uid, name: data.name, content: data.content, date: toDate(data.createdAt) };
  });
}

export function createComment(postId: string, author: BoardAuthor, input: CommentInput) {
  return addDoc(collection(getDb(), "posts", postId, "comments"), {
    uid: author.uid,
    name: maskName(author.displayName),
    content: input.content,
    createdAt: serverTimestamp(),
  });
}

export function deleteComment(postId: string, commentId: string) {
  return deleteDoc(doc(getDb(), "posts", postId, "comments", commentId));
}
