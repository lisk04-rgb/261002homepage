import { z } from "zod";

// 브라우저 검증과 firestore.rules 검증의 기준을 맞춰 둔다(최대 글자 수 등).
export const REVIEW_MIN_LENGTH = 10;
export const REVIEW_MAX_LENGTH = 1000;

export const memberReviewInputSchema = z.object({
  rating: z.number().int().min(1, { error: "별점을 선택해 주세요." }).max(5),
  content: z
    .string()
    .trim()
    .min(REVIEW_MIN_LENGTH, { error: `후기는 ${REVIEW_MIN_LENGTH}자 이상 적어 주세요.` })
    .max(REVIEW_MAX_LENGTH, { error: `후기는 ${REVIEW_MAX_LENGTH}자까지 쓸 수 있어요.` }),
});

export type MemberReviewInput = z.infer<typeof memberReviewInputSchema>;

/** 공개되는 이름은 가운데를 가린다. 예: 김민지 → 김*지, John Doe → J*e */
export function maskName(name: string | null | undefined): string {
  const chars = Array.from((name ?? "").trim().replace(/\s+/g, ""));
  if (chars.length === 0) return "회원";
  if (chars.length <= 2) return `${chars[0]}*`;
  return `${chars[0]}${"*".repeat(Math.min(chars.length - 2, 3))}${chars[chars.length - 1]}`;
}
