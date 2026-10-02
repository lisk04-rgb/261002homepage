import type { CatalogSummary, SortKey } from "@/types/content";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "추천순" },
  { value: "title", label: "이름순" },
  { value: "price-asc", label: "가격 낮은순" },
  { value: "price-desc", label: "가격 높은순" },
];

export const ALL_CATEGORIES = "전체";

export function getCategories(items: Pick<CatalogSummary, "category">[]): string[] {
  return [ALL_CATEGORIES, ...new Set(items.map((item) => item.category))];
}

export function filterByCategory<T extends Pick<CatalogSummary, "category">>(
  items: T[],
  category: string,
): T[] {
  if (category === ALL_CATEGORIES) return items;
  return items.filter((item) => item.category === category);
}

type Sortable = Pick<CatalogSummary, "title" | "price" | "featured" | "order">;

// 가격 정렬 시 "문의 후 안내"(가격 없음) 항목은 항상 뒤로 보낸다.
function comparePrice(a: Sortable, b: Sortable, direction: 1 | -1): number {
  if (a.price === undefined && b.price === undefined) return 0;
  if (a.price === undefined) return 1;
  if (b.price === undefined) return -1;
  return (a.price - b.price) * direction;
}

export function sortItems<T extends Sortable>(items: T[], sortKey: SortKey): T[] {
  const sorted = [...items];
  const byTitle = (a: T, b: T) => a.title.localeCompare(b.title, "ko");
  switch (sortKey) {
    case "title":
      return sorted.sort(byTitle);
    case "price-asc":
      return sorted.sort((a, b) => comparePrice(a, b, 1) || byTitle(a, b));
    case "price-desc":
      return sorted.sort((a, b) => comparePrice(a, b, -1) || byTitle(a, b));
    case "featured":
    default:
      return sorted.sort(
        (a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order || byTitle(a, b),
      );
  }
}

/** 같은 카테고리 → 태그 겹침 순으로 관련 항목을 고른다. */
export function getRelatedItems<T extends Pick<CatalogSummary, "slug" | "category" | "tags">>(
  items: T[],
  current: T,
  limit = 3,
): T[] {
  const score = (item: T) =>
    (item.category === current.category ? 10 : 0) +
    item.tags.filter((tag) => current.tags.includes(tag)).length;
  return items
    .filter((item) => item.slug !== current.slug)
    .map((item, index) => ({ item, index, score: score(item) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map(({ item }) => item);
}

export function toSummary<T extends CatalogSummary & { description?: string }>(
  item: T,
): CatalogSummary {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { description, ...summary } = item;
  return summary;
}
