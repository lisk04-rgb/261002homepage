import { describe, expect, it } from "vitest";
import { COMMENT_MAX, POST_CONTENT_MAX, POST_TITLE_MAX, commentInputSchema, postInputSchema } from "@/lib/board";

describe("postInputSchema", () => {
  it("앞뒤 공백을 지우고 통과", () => {
    expect(postInputSchema.parse({ title: "  안녕하세요  ", content: " 반가워요 " })).toEqual({
      title: "안녕하세요",
      content: "반가워요",
    });
  });
  it("공백뿐인 제목·내용은 실패", () => {
    expect(postInputSchema.safeParse({ title: "   ", content: "내용입니다" }).success).toBe(false);
    expect(postInputSchema.safeParse({ title: "제목입니다", content: "   " }).success).toBe(false);
  });
  it("길이 제한", () => {
    expect(postInputSchema.safeParse({ title: "가".repeat(POST_TITLE_MAX + 1), content: "내용입니다" }).success).toBe(false);
    expect(postInputSchema.safeParse({ title: "제목입니다", content: "가".repeat(POST_CONTENT_MAX + 1) }).success).toBe(false);
    expect(postInputSchema.safeParse({ title: "가".repeat(POST_TITLE_MAX), content: "가".repeat(POST_CONTENT_MAX) }).success).toBe(true);
  });
});

describe("commentInputSchema", () => {
  it("한 글자 댓글도 허용, 빈 댓글·초과는 실패", () => {
    expect(commentInputSchema.safeParse({ content: "ㅎ" }).success).toBe(true);
    expect(commentInputSchema.safeParse({ content: "  " }).success).toBe(false);
    expect(commentInputSchema.safeParse({ content: "가".repeat(COMMENT_MAX + 1) }).success).toBe(false);
  });
});
