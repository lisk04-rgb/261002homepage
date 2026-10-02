import { z } from "zod";

// 브라우저 검증과 firestore.rules 검증의 기준을 맞춰 둔다.
export const POST_TITLE_MAX = 100;
export const POST_CONTENT_MAX = 3000;
export const COMMENT_MAX = 500;
export const BOARD_PAGE_SIZE = 20;

export const postInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, { error: "제목을 2자 이상 적어 주세요." })
    .max(POST_TITLE_MAX, { error: `제목은 ${POST_TITLE_MAX}자까지 쓸 수 있어요.` }),
  content: z
    .string()
    .trim()
    .min(2, { error: "내용을 2자 이상 적어 주세요." })
    .max(POST_CONTENT_MAX, { error: `내용은 ${POST_CONTENT_MAX}자까지 쓸 수 있어요.` }),
});

export const commentInputSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, { error: "댓글 내용을 적어 주세요." })
    .max(COMMENT_MAX, { error: `댓글은 ${COMMENT_MAX}자까지 쓸 수 있어요.` }),
});

export type PostInput = z.infer<typeof postInputSchema>;
export type CommentInput = z.infer<typeof commentInputSchema>;
