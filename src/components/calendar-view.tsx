"use client";

import { useEffect, useMemo, useState } from "react";
import { EventItem } from "@/components/event-item";
import {
  EVENT_TYPE_COLORS,
  EVENT_TYPE_LABELS,
  buildMonthGrid,
  eventsInMonth,
  eventsOnDate,
  todayISO,
  upcomingEvents,
} from "@/lib/calendar";
import { EVENT_TYPES } from "@/lib/schemas";
import type { CalendarEvent } from "@/types/content";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

/** 서버(빌드)와 브라우저의 "오늘"이 달라 생기는 화면 불일치를 피하려고, 첫 렌더는 첫 일정의 달로 그린다. */
function initialMonth(events: CalendarEvent[]) {
  const [year = "2026", month = "1"] = (events[0]?.date ?? "2026-01-01").split("-");
  return { year: Number(year), month: Number(month) };
}

export function CalendarView({ events }: { events: CalendarEvent[] }) {
  const [cursor, setCursor] = useState(() => initialMonth(events));
  const [today, setToday] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const now = todayISO();
    setToday(now);
    const [year = "2026", month = "1"] = now.split("-");
    setCursor({ year: Number(year), month: Number(month) });
  }, []);

  const weeks = useMemo(() => buildMonthGrid(cursor.year, cursor.month), [cursor]);
  const monthEvents = useMemo(() => eventsInMonth(events, cursor.year, cursor.month), [events, cursor]);
  const selectedEvents = selected ? eventsOnDate(events, selected) : [];
  const upcoming = today ? upcomingEvents(events, today) : [];

  const moveMonth = (delta: number) => {
    setSelected(null);
    setCursor(({ year, month }) => {
      const next = new Date(year, month - 1 + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() + 1 };
    });
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-navy-900" aria-live="polite">
            {cursor.year}년 {cursor.month}월
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => moveMonth(-1)}
              aria-label="이전 달"
              className="min-h-11 min-w-11 rounded-full border border-beige-300 bg-white text-navy-900 hover:border-navy-500"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => moveMonth(1)}
              aria-label="다음 달"
              className="min-h-11 min-w-11 rounded-full border border-beige-300 bg-white text-navy-900 hover:border-navy-500"
            >
              →
            </button>
          </div>
        </div>

        <table className="mt-4 w-full table-fixed border-separate border-spacing-1">
          <caption className="sr-only">
            {cursor.year}년 {cursor.month}월 일정 달력. 날짜를 누르면 그날의 일정을 볼 수 있어요.
          </caption>
          <thead>
            <tr>
              {WEEKDAYS.map((day) => (
                <th key={day} scope="col" className="py-1 text-sm font-medium text-navy-500">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week) => (
              <tr key={week[0]?.date}>
                {week.map((cell) => {
                  const dayEvents = eventsOnDate(events, cell.date);
                  const dayNumber = Number(cell.date.slice(-2));
                  const isToday = cell.date === today;
                  const isSelected = cell.date === selected;
                  return (
                    <td key={cell.date} className="p-0">
                      <button
                        type="button"
                        onClick={() => setSelected(isSelected ? null : cell.date)}
                        aria-pressed={isSelected}
                        aria-label={`${cell.date.replaceAll("-", ". ")}.${
                          dayEvents.length > 0 ? ` 일정 ${dayEvents.length}개` : ""
                        }${isToday ? " 오늘" : ""}`}
                        className={`flex h-14 w-full flex-col items-center justify-start gap-1 rounded-lg pt-1.5 text-sm sm:h-16 ${
                          isSelected
                            ? "bg-navy-900 text-white"
                            : cell.inMonth
                              ? "bg-white text-navy-900 hover:bg-beige-100"
                              : "bg-transparent text-navy-500/70 hover:bg-beige-100"
                        } ${isToday && !isSelected ? "ring-2 ring-terracotta-600" : ""}`}
                      >
                        <span className={isToday ? "font-bold" : ""}>{dayNumber}</span>
                        <span className="flex gap-0.5" aria-hidden="true">
                          {dayEvents.slice(0, 3).map((event) => (
                            <span
                              key={event.id}
                              className={`h-1.5 w-1.5 rounded-full ${isSelected ? "bg-white" : EVENT_TYPE_COLORS[event.type]}`}
                            />
                          ))}
                        </span>
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-navy-700" aria-label="일정 종류">
          {EVENT_TYPES.map((type) => (
            <li key={type} className="flex items-center gap-1.5">
              <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${EVENT_TYPE_COLORS[type]}`} />
              {EVENT_TYPE_LABELS[type]}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-10">
        {selected && (
          <section aria-labelledby="selected-title">
            <h2 id="selected-title" className="text-lg font-bold text-navy-900">
              {selected.replaceAll("-", ". ")}. 일정
            </h2>
            {selectedEvents.length > 0 ? (
              <ul className="mt-3 space-y-3">
                {selectedEvents.map((event) => (
                  <li key={event.id}>
                    <EventItem event={event} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-navy-700">이 날은 등록된 일정이 없어요.</p>
            )}
          </section>
        )}

        <section aria-labelledby="month-title">
          <h2 id="month-title" className="text-lg font-bold text-navy-900">
            {cursor.month}월 일정 <span className="text-navy-500">{monthEvents.length}</span>
          </h2>
          {monthEvents.length > 0 ? (
            <ul className="mt-3 space-y-3">
              {monthEvents.map((event) => (
                <li key={event.id}>
                  <EventItem event={event} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-navy-700">이 달에는 등록된 일정이 없어요.</p>
          )}
        </section>

        {upcoming.length > 0 && (
          <p className="text-sm text-navy-500">앞으로 예정된 일정은 총 {upcoming.length}개예요.</p>
        )}
      </div>
    </div>
  );
}
