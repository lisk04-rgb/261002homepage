import { EVENT_TYPE_COLORS, EVENT_TYPE_LABELS } from "@/lib/calendar";
import type { EventType } from "@/types/content";

export function EventBadge({ type }: { type: EventType }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-beige-100 px-2.5 py-0.5 text-sm font-medium text-navy-900">
      <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${EVENT_TYPE_COLORS[type]}`} />
      {EVENT_TYPE_LABELS[type]}
    </span>
  );
}
