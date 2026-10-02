import { describe, expect, it } from "vitest";
import { buildMonthGrid, eventsInMonth, eventsOnDate, formatEventPeriod, todayISO, upcomingEvents } from "@/lib/calendar";

describe("buildMonthGrid", () => {
  it("2026년 10월: 목요일 시작, 항상 7칸 단위, 해당 월 31일 포함", () => {
    const weeks = buildMonthGrid(2026, 10);
    expect(weeks.every((week) => week.length === 7)).toBe(true);
    expect(weeks[0]?.[4]).toEqual({ date: "2026-10-01", inMonth: true });
    expect(weeks[0]?.[0]).toEqual({ date: "2026-09-27", inMonth: false });
    expect(weeks.flat().filter((cell) => cell.inMonth)).toHaveLength(31);
  });
  it("연도 경계(2026년 12월 → 2027년 1월 칸)", () => {
    const last = buildMonthGrid(2026, 12).flat().at(-1);
    expect(last?.date.startsWith("2027-01") || last?.date.startsWith("2026-12")).toBe(true);
  });
  it("윤년 2월은 29일", () => {
    expect(buildMonthGrid(2028, 2).flat().filter((cell) => cell.inMonth)).toHaveLength(29);
  });
});

describe("이벤트 조회", () => {
  const events = [
    { date: "2026-10-12", endDate: "2026-10-23" },
    { date: "2026-11-02" },
    { date: "2026-09-01", endDate: "2026-09-05" },
  ];
  it("기간 일정은 기간 내 모든 날짜에 잡힌다", () => {
    expect(eventsOnDate(events, "2026-10-15")).toHaveLength(1);
    expect(eventsOnDate(events, "2026-10-24")).toHaveLength(0);
    expect(eventsOnDate(events, "2026-10-12")).toHaveLength(1);
  });
  it("지난 일정은 제외, 진행 중은 포함, 시작일 순", () => {
    expect(upcomingEvents(events, "2026-10-20").map((event) => event.date)).toEqual(["2026-10-12", "2026-11-02"]);
    expect(upcomingEvents(events, "2026-10-20", 1)).toHaveLength(1);
  });
  it("월 범위: 달에 걸치는 일정 포함", () => {
    expect(eventsInMonth([{ date: "2026-09-28", endDate: "2026-10-03" }], 2026, 10)).toHaveLength(1);
    expect(eventsInMonth(events, 2026, 11)).toHaveLength(1);
  });
  it("기간 표시", () => {
    expect(formatEventPeriod({ date: "2026-10-12", endDate: "2026-10-23" })).toBe("2026. 10. 12. ~ 2026. 10. 23.");
    expect(formatEventPeriod({ date: "2026-11-02" })).toBe("2026. 11. 2.");
  });
  it("todayISO는 로컬 날짜 기준", () => {
    expect(todayISO(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});
