import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { loadCatalog, loadEvents, loadReviews, loadSiteConfig } from "@/lib/content";

const tempDirs: string[] = [];

function makeContentDir(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "content-"));
  tempDirs.push(dir);
  for (const [relativePath, body] of Object.entries(files)) {
    const filePath = path.join(dir, relativePath);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, body);
  }
  return dir;
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

const validMdx = (extra = "") => `---
title: 테스트 머그
summary: 요약
category: 도자기
images: [/images/a.svg]
${extra}
---
본문입니다.`;

describe("loadCatalog", () => {
  it("파일 이름을 slug로, 본문을 description으로 읽고 기본값을 채운다", () => {
    const dir = makeContentDir({ "products/test-mug.mdx": validMdx("price: 1000") });
    const [item] = loadCatalog("products", dir);
    expect(item).toMatchObject({
      slug: "test-mug",
      kind: "products",
      price: 1000,
      tags: [],
      featured: false,
      description: "본문입니다.",
    });
  });

  it("가격이 없으면 price는 undefined (문의 후 안내)", () => {
    const dir = makeContentDir({ "services/a.mdx": validMdx() });
    expect(loadCatalog("services", dir)[0]?.price).toBeUndefined();
  });

  it("필수 칸이 빠지면 파일 이름과 함께 오류를 낸다", () => {
    const dir = makeContentDir({ "products/broken.mdx": "---\ntitle: 이름만\n---\n" });
    expect(() => loadCatalog("products", dir)).toThrow(/products\/broken\.mdx[\s\S]*summary/);
  });

  it("가격을 '39,000'처럼 문자로 적으면 오류를 낸다", () => {
    const dir = makeContentDir({ "products/a.mdx": validMdx('price: "39,000"') });
    expect(() => loadCatalog("products", dir)).toThrow(/price/);
  });

  it("slug에 한글·대문자가 있으면 오류를 낸다", () => {
    const dir = makeContentDir({ "products/머그.mdx": validMdx() });
    expect(() => loadCatalog("products", dir)).toThrow(/영문 소문자/);
  });

  it("_로 시작하는 파일(템플릿)은 무시한다", () => {
    const dir = makeContentDir({ "products/_template.mdx": "아무거나", "products/a.mdx": validMdx() });
    expect(loadCatalog("products", dir).map((item) => item.slug)).toEqual(["a"]);
  });

  it("폴더가 없으면 빈 배열", () => {
    expect(loadCatalog("products", makeContentDir({}))).toEqual([]);
  });
});

describe("loadReviews", () => {
  it("최신 날짜 순으로 정렬한다", () => {
    const review = (date: string) => JSON.stringify({ name: "김*", rating: 5, content: "좋아요", date });
    const dir = makeContentDir({ "reviews/old.json": review("2026-01-01"), "reviews/new.json": review("2026-05-01") });
    expect(loadReviews(dir).map((item) => item.id)).toEqual(["new", "old"]);
  });

  it("JSON 문법이 틀리면 친절한 오류를 낸다", () => {
    const dir = makeContentDir({ "reviews/bad.json": "{ name: 김 }" });
    expect(() => loadReviews(dir)).toThrow(/JSON 형식/);
  });
});

describe("loadEvents", () => {
  it("날짜순 정렬, 잘못된 type과 거꾸로 된 기간은 오류", () => {
    const event = (date: string, extra = "") => JSON.stringify({ title: "일정", date, type: "start", ...JSON.parse(extra || "{}") });
    const dir = makeContentDir({ "events/b.json": event("2026-12-01"), "events/a.json": event("2026-10-01") });
    expect(loadEvents(dir).map((item) => item.id)).toEqual(["a", "b"]);
    const bad = makeContentDir({ "events/x.json": JSON.stringify({ title: "x", date: "2026-10-05", endDate: "2026-10-01", type: "start" }) });
    expect(() => loadEvents(bad)).toThrow(/endDate/);
    const badType = makeContentDir({ "events/y.json": JSON.stringify({ title: "y", date: "2026-10-05", type: "zzz" }) });
    expect(() => loadEvents(badType)).toThrow(/type/);
  });
});

describe("실제 content 폴더", () => {
  it("샘플 콘텐츠가 모두 스키마를 통과한다", () => {
    expect(loadCatalog("services").length).toBeGreaterThanOrEqual(2);
    expect(loadCatalog("products")).toBeInstanceOf(Array);
    expect(loadReviews()).toBeInstanceOf(Array);
    expect(loadEvents().length).toBeGreaterThan(0);
    expect(loadSiteConfig().name).toBeTruthy();
  });
});
