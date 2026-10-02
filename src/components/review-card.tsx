import { formatDate } from "@/lib/format";
import type { Review } from "@/types/content";

export function ReviewCard({ review, targetTitle }: { review: Review; targetTitle?: string }) {
  return (
    <figure className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-beige-200">
      <p className="text-terracotta-600">
        <span role="img" aria-label={`별점 5점 만점에 ${review.rating}점`}>
          <span aria-hidden="true">
            {"★".repeat(review.rating)}
            <span className="text-beige-300">{"★".repeat(5 - review.rating)}</span>
          </span>
        </span>
      </p>
      <blockquote className="mt-3 flex-1 text-navy-700">
        <p>{review.content}</p>
      </blockquote>
      <figcaption className="mt-4 text-sm text-navy-500">
        <span className="font-semibold text-navy-900">{review.name}</span>
        {targetTitle && <> · {targetTitle}</>} · <time dateTime={review.date}>{formatDate(review.date)}</time>
      </figcaption>
    </figure>
  );
}
