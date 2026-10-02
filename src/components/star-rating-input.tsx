"use client";

export function StarRatingInput({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-navy-900">별점</legend>
      <div className="mt-1 flex gap-1">
        {[1, 2, 3, 4, 5].map((score) => (
          <label key={score} className="cursor-pointer">
            <input
              type="radio"
              name="rating"
              value={score}
              checked={value === score}
              onChange={() => onChange(score)}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className={`block rounded text-3xl leading-none peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-terracotta-500 ${
                score <= value ? "text-terracotta-600" : "text-beige-300"
              }`}
            >
              ★
            </span>
            <span className="sr-only">{score}점</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
