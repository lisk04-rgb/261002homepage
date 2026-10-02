import { describe, expect, it } from "vitest";
import { REVIEW_MAX_LENGTH, maskName, memberReviewInputSchema } from "@/lib/member-review";

describe("maskName", () => {
  it.each([
    ["김민지", "김*지"],
    ["이현", "이*"],
    ["남궁민수", "남**수"],
    ["John Doe", "J***e"],
    ["", "회원"],
    [null, "회원"],
  ])("%s → %s", (input, expected) => {
    expect(maskName(input)).toBe(expected);
  });
});

describe("memberReviewInputSchema", () => {
  it("정상 입력은 앞뒤 공백을 지우고 통과", () => {
    const result = memberReviewInputSchema.parse({ rating: 5, content: "  정말 마음에 들어요. 또 살게요!  " });
    expect(result.content).toBe("정말 마음에 들어요. 또 살게요!");
  });
  it("별점 미선택(0)은 실패", () => {
    expect(memberReviewInputSchema.safeParse({ rating: 0, content: "열 글자 이상 적었어요" }).success).toBe(false);
  });
  it("너무 짧거나 긴 내용은 실패", () => {
    expect(memberReviewInputSchema.safeParse({ rating: 5, content: "짧아요" }).success).toBe(false);
    expect(memberReviewInputSchema.safeParse({ rating: 5, content: "가".repeat(REVIEW_MAX_LENGTH + 1) }).success).toBe(false);
  });
});
