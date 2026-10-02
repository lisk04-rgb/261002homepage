import { describe, expect, it } from "vitest";
import { assignmentInputSchema } from "@/lib/assignment";

const valid = { program: "home-buying-4week-coaching", week: 1, title: "1주차 과제", content: "현재 자산과 목표를 정리했습니다." };

describe("assignmentInputSchema", () => {
  it("링크 없이도 통과, 공백은 정리", () => {
    expect(assignmentInputSchema.parse({ ...valid, title: "  1주차 과제 " }).title).toBe("1주차 과제");
    expect(assignmentInputSchema.safeParse({ ...valid, link: "" }).success).toBe(true);
  });
  it("https 링크만 허용", () => {
    expect(assignmentInputSchema.safeParse({ ...valid, link: "https://docs.google.com/x" }).success).toBe(true);
    expect(assignmentInputSchema.safeParse({ ...valid, link: "javascript:alert(1)" }).success).toBe(false);
    expect(assignmentInputSchema.safeParse({ ...valid, link: "drive.google.com/x" }).success).toBe(false);
  });
  it("주차 범위·내용 길이·프로그램 값 검증", () => {
    expect(assignmentInputSchema.safeParse({ ...valid, week: 5 }).success).toBe(false);
    expect(assignmentInputSchema.safeParse({ ...valid, content: "짧음" }).success).toBe(false);
    expect(assignmentInputSchema.safeParse({ ...valid, program: "" }).success).toBe(false);
  });
});
