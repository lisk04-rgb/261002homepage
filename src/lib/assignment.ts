import { z } from "zod";

// 브라우저 검증과 firestore.rules 검증의 기준을 맞춰 둔다.
export const ASSIGNMENT_TITLE_MAX = 100;
export const ASSIGNMENT_CONTENT_MIN = 10;
export const ASSIGNMENT_CONTENT_MAX = 3000;
export const ASSIGNMENT_LINK_MAX = 300;

/** 0은 주차와 무관한 제출(예: 컨설팅 사전 자료) */
export const WEEK_OPTIONS = [
  { value: 1, label: "1주차" },
  { value: 2, label: "2주차" },
  { value: 3, label: "3주차" },
  { value: 4, label: "4주차" },
  { value: 0, label: "주차 없음(기타)" },
] as const;

export const assignmentInputSchema = z.object({
  program: z
    .string()
    .regex(/^[a-z0-9-]+$/, { error: "프로그램을 선택해 주세요." }),
  week: z.number().int().min(0).max(4),
  title: z
    .string()
    .trim()
    .min(2, { error: "제목을 2자 이상 적어 주세요." })
    .max(ASSIGNMENT_TITLE_MAX, { error: `제목은 ${ASSIGNMENT_TITLE_MAX}자까지 쓸 수 있어요.` }),
  content: z
    .string()
    .trim()
    .min(ASSIGNMENT_CONTENT_MIN, { error: `내용을 ${ASSIGNMENT_CONTENT_MIN}자 이상 적어 주세요.` })
    .max(ASSIGNMENT_CONTENT_MAX, { error: `내용은 ${ASSIGNMENT_CONTENT_MAX}자까지 쓸 수 있어요.` }),
  // 파일 업로드(Firebase Storage)는 Spark 요금제로 쓸 수 없어, 구글 드라이브·노션 등 공유 링크로 받는다.
  link: z
    .string()
    .trim()
    .max(ASSIGNMENT_LINK_MAX, { error: "링크가 너무 길어요." })
    .refine((value) => value === "" || /^https?:\/\/\S+$/.test(value), {
      error: "링크는 https:// 로 시작하는 주소를 적어 주세요.",
    })
    .optional(),
});

export type AssignmentInput = z.infer<typeof assignmentInputSchema>;
