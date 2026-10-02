import type { CalendarEvent, EventType } from "@/types/content";

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  launch: "런칭",
  start: "시작",
  recruit: "모집",
  deadline: "마감",
  event: "행사",
};

// 색만으로 구분하지 않도록 화면에서는 항상 라벨 글자를 함께 보여 준다.
export const EVENT_TYPE_COLORS: Record<EventType, string> = {
  launch: "bg-terracotta-600",
  start: "bg-navy-900",
  recruit: "bg-navy-500",
  deadline: "bg-terracotta-700",
  event: "bg-beige-300",
};

export type DayCell = { date: string; inMonth: boolean };

const pad = (value: number) => String(value).padStart(2, "0");

export const toISODate = (year: number, month: number, day: number) => `${year}-${pad(month)}-${pad(day)}`;

/** 로컬(브라우저) 기준 오늘 날짜. 서버 시간대에 흔들리지 않게 Date의 로컬 값을 쓴다. */
export const todayISO = (now = new Date()) => toISODate(now.getFullYear(), now.getMonth() + 1, now.getDate());

/** month는 1~12. 일요일 시작, 항상 완전한 주 단위로 채운다. */
export function buildMonthGrid(year: number, month: number): DayCell[][] {
  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: DayCell[] = [];

  for (let offset = firstWeekday; offset > 0; offset--) {
    const date = new Date(year, month - 1, 1 - offset);
    cells.push({ date: toISODate(date.getFullYear(), date.getMonth() + 1, date.getDate()), inMonth: false });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ date: toISODate(year, month, day), inMonth: true });
  }
  for (let extra = 1; cells.length % 7 !== 0; extra++) {
    const date = new Date(year, month, extra);
    cells.push({ date: toISODate(date.getFullYear(), date.getMonth() + 1, date.getDate()), inMonth: false });
  }

  const weeks: DayCell[][] = [];
  for (let index = 0; index < cells.length; index += 7) weeks.push(cells.slice(index, index + 7));
  return weeks;
}

export const eventEnd = (event: Pick<CalendarEvent, "date" | "endDate">) => event.endDate ?? event.date;

export function eventsOnDate<T extends Pick<CalendarEvent, "date" | "endDate">>(events: T[], date: string): T[] {
  return events.filter((event) => event.date <= date && date <= eventEnd(event));
}

/** 아직 끝나지 않은 일정(진행 중 포함)을 시작일 순으로. */
export function upcomingEvents<T extends Pick<CalendarEvent, "date" | "endDate">>(
  events: T[],
  today: string,
  limit?: number,
): T[] {
  const result = events.filter((event) => eventEnd(event) >= today).sort((a, b) => a.date.localeCompare(b.date));
  return limit === undefined ? result : result.slice(0, limit);
}

export function eventsInMonth<T extends Pick<CalendarEvent, "date" | "endDate">>(
  events: T[],
  year: number,
  month: number,
): T[] {
  const first = toISODate(year, month, 1);
  const last = toISODate(year, month, new Date(year, month, 0).getDate());
  return events.filter((event) => event.date <= last && eventEnd(event) >= first);
}

export function formatEventPeriod(event: Pick<CalendarEvent, "date" | "endDate">): string {
  const short = (iso: string) => {
    const [year, month, day] = iso.split("-");
    return `${year}. ${Number(month)}. ${Number(day)}.`;
  };
  return event.endDate && event.endDate !== event.date ? `${short(event.date)} ~ ${short(event.endDate)}` : short(event.date);
}
