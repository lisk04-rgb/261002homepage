import Link from "next/link";
import { EventBadge } from "@/components/event-badge";
import { formatEventPeriod } from "@/lib/calendar";
import type { CalendarEvent } from "@/types/content";

export function EventItem({ event }: { event: CalendarEvent }) {
  return (
    <article className="rounded-xl bg-white p-4 ring-1 ring-beige-200">
      <div className="flex flex-wrap items-center gap-2">
        <EventBadge type={event.type} />
        <p className="text-sm text-navy-500">{formatEventPeriod(event)}</p>
      </div>
      <h3 className="mt-2 font-bold text-navy-900">{event.title}</h3>
      {event.description && <p className="mt-1 text-sm text-navy-700">{event.description}</p>}
      {event.link && (
        <Link href={event.link} className="mt-2 inline-block text-sm font-semibold text-terracotta-700 underline">
          자세히 보기
        </Link>
      )}
    </article>
  );
}
