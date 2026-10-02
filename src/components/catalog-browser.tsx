"use client";

import { useMemo, useState } from "react";
import { ItemCard } from "@/components/item-card";
import { ALL_CATEGORIES, SORT_OPTIONS, filterByCategory, getCategories, sortItems } from "@/lib/catalog";
import type { CatalogSummary, SortKey } from "@/types/content";

export function CatalogBrowser({ items, label }: { items: CatalogSummary[]; label: string }) {
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const [sortKey, setSortKey] = useState<SortKey>("featured");

  const categories = useMemo(() => getCategories(items), [items]);
  const visibleItems = useMemo(
    () => sortItems(filterByCategory(items, category), sortKey),
    [items, category, sortKey],
  );

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="카테고리 필터" className="flex flex-wrap gap-2">
          {categories.map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={category === name}
              onClick={() => setCategory(name)}
              className={`min-h-11 rounded-full border px-4 text-sm font-medium transition-colors ${
                category === name
                  ? "border-navy-900 bg-navy-900 text-white"
                  : "border-beige-300 bg-white text-navy-700 hover:border-navy-500"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-navy-700">
            정렬
          </label>
          <select
            id="sort"
            value={sortKey}
            onChange={(event) => setSortKey(event.target.value as SortKey)}
            className="min-h-11 rounded-lg border border-beige-300 bg-white px-3 text-sm text-navy-900"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mt-6 text-sm text-navy-700" aria-live="polite">
        {label} {visibleItems.length}개
      </p>

      {visibleItems.length > 0 ? (
        <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map((item) => (
            <li key={item.slug}>
              <ItemCard item={item} headingLevel="h2" />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 rounded-xl bg-beige-100 p-8 text-center text-navy-700">
          해당 카테고리에 등록된 {label}이 없어요.
        </p>
      )}
    </div>
  );
}
