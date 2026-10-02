import { describe, expect, it } from "vitest";
import { ALL_CATEGORIES, filterByCategory, getCategories, getRelatedItems, sortItems } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

const item = (slug: string, overrides: Partial<{ price: number; category: string; featured: boolean; order: number; tags: string[] }> = {}) => ({
  slug,
  title: slug,
  category: "A",
  featured: false,
  order: 100,
  tags: [] as string[],
  ...overrides,
});

describe("sortItems", () => {
  const items = [item("다", { price: 3000 }), item("가"), item("나", { price: 1000, featured: true })];

  it("가격 낮은순: 가격 없는 항목은 맨 뒤", () => {
    expect(sortItems(items, "price-asc").map((i) => i.slug)).toEqual(["나", "다", "가"]);
  });
  it("가격 높은순: 가격 없는 항목은 맨 뒤", () => {
    expect(sortItems(items, "price-desc").map((i) => i.slug)).toEqual(["다", "나", "가"]);
  });
  it("추천순: featured 먼저", () => {
    expect(sortItems(items, "featured")[0]?.slug).toBe("나");
  });
  it("이름순: 가나다", () => {
    expect(sortItems(items, "title").map((i) => i.slug)).toEqual(["가", "나", "다"]);
  });
  it("원본 배열을 바꾸지 않는다", () => {
    sortItems(items, "title");
    expect(items[0]?.slug).toBe("다");
  });
});

describe("카테고리", () => {
  const items = [item("a", { category: "도자기" }), item("b", { category: "캔들" }), item("c", { category: "도자기" })];
  it("전체 + 중복 없는 카테고리 목록", () => {
    expect(getCategories(items)).toEqual([ALL_CATEGORIES, "도자기", "캔들"]);
  });
  it("필터", () => {
    expect(filterByCategory(items, "도자기")).toHaveLength(2);
    expect(filterByCategory(items, ALL_CATEGORIES)).toHaveLength(3);
  });
});

describe("getRelatedItems", () => {
  it("자기 자신 제외, 같은 카테고리 우선", () => {
    const current = item("me", { category: "도자기", tags: ["선물"] });
    const others = [item("x", { category: "캔들", tags: ["선물"] }), item("y", { category: "도자기" }), current];
    expect(getRelatedItems(others, current).map((i) => i.slug)).toEqual(["y", "x"]);
  });
});

describe("formatPrice", () => {
  it("원화 표기와 문의 후 안내", () => {
    expect(formatPrice(39000)).toBe("39,000원");
    expect(formatPrice(undefined)).toBe("문의 후 안내");
  });
});
