"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Container } from "@/components/container";
import { EventItem } from "@/components/event-item";
import { SectionHeading } from "@/components/section-heading";
import { todayISO, upcomingEvents } from "@/lib/calendar";
import type { CalendarEvent } from "@/types/content";

/** 오늘 날짜는 방문자 브라우저 기준으로 계산해, 정적 빌드 이후에도 지난 일정이 자동으로 빠지게 한다. */
export function UpcomingEvents({ events, limit = 3 }: { events: CalendarEvent[]; limit?: number }) {
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => setToday(todayISO()), []);

  if (events.length === 0) return null;
  const upcoming = today ? upcomingEvents(events, today, limit) : [];

  return (
    <section aria-labelledby="upcoming-title" className="mt-24">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading id="upcoming-title" eyebrow="일정" title="다가오는 일정" />
          <Link href="/calendar" className="text-sm font-semibold text-terracotta-700 hover:underline">
            캘린더 전체 보기 →
          </Link>
        </div>
        <div className="mt-8 min-h-24">
          {today && upcoming.length === 0 && <p className="text-navy-700">예정된 일정이 아직 없어요.</p>}
          {upcoming.length > 0 && (
            <ul className="grid gap-4 md:grid-cols-3">
              {upcoming.map((event) => (
                <li key={event.id}>
                  <EventItem event={event} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </section>
  );
}
