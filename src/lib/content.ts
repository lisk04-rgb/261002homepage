import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { catalogFrontmatterSchema, eventSchema, reviewSchema, siteConfigSchema } from "@/lib/schemas";
import type {
  CatalogItem,
  CalendarEvent,
  CatalogKind,
  Product,
  Review,
  Service,
  SiteConfig,
} from "@/types/content";

const DEFAULT_CONTENT_DIR = path.join(process.cwd(), "content");
const SLUG_PATTERN = /^[a-z0-9-]+$/;

function formatIssues(error: z.ZodError): string {
  return error.issues
    .map((issue) => `  - ${issue.path.join(".") || "(전체)"}: ${issue.message}`)
    .join("\n");
}

function listFiles(dir: string, extension: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(extension) && !file.startsWith("_"))
    .sort();
}

/** content/{products|services}/*.mdx 를 읽어 검증한다. 파일 이름이 곧 주소(slug)다. */
export function loadCatalog(kind: CatalogKind, contentDir = DEFAULT_CONTENT_DIR): CatalogItem[] {
  const dir = path.join(contentDir, kind);
  const items = listFiles(dir, ".mdx").map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const filePath = path.join(kind, file);
    if (!SLUG_PATTERN.test(slug)) {
      throw new Error(
        `[콘텐츠 오류] ${filePath}: 파일 이름은 영문 소문자, 숫자, 하이픈(-)만 쓸 수 있어요.`,
      );
    }
    const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
    const parsed = catalogFrontmatterSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(`[콘텐츠 오류] ${filePath}\n${formatIssues(parsed.error)}`);
    }
    return { ...parsed.data, kind, slug, description: content.trim() };
  });
  return items.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, "ko"));
}

export function loadReviews(contentDir = DEFAULT_CONTENT_DIR): Review[] {
  const dir = path.join(contentDir, "reviews");
  return listFiles(dir, ".json")
    .map((file) => {
      const filePath = path.join("reviews", file);
      let raw: unknown;
      try {
        raw = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
      } catch {
        throw new Error(`[콘텐츠 오류] ${filePath}: JSON 형식이 올바르지 않아요. 쉼표와 따옴표를 확인해 주세요.`);
      }
      const parsed = reviewSchema.safeParse(raw);
      if (!parsed.success) {
        throw new Error(`[콘텐츠 오류] ${filePath}\n${formatIssues(parsed.error)}`);
      }
      return { ...parsed.data, id: file.replace(/\.json$/, "") };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function loadEvents(contentDir = DEFAULT_CONTENT_DIR): CalendarEvent[] {
  const dir = path.join(contentDir, "events");
  return listFiles(dir, ".json")
    .map((file) => {
      const filePath = path.join("events", file);
      let raw: unknown;
      try {
        raw = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
      } catch {
        throw new Error(`[콘텐츠 오류] ${filePath}: JSON 형식이 올바르지 않아요. 쉼표와 따옴표를 확인해 주세요.`);
      }
      const parsed = eventSchema.safeParse(raw);
      if (!parsed.success) {
        throw new Error(`[콘텐츠 오류] ${filePath}\n${formatIssues(parsed.error)}`);
      }
      return { ...parsed.data, id: file.replace(/\.json$/, "") };
    })
    .sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title, "ko"));
}

export function loadSiteConfig(contentDir = DEFAULT_CONTENT_DIR): SiteConfig {
  const raw: unknown = JSON.parse(fs.readFileSync(path.join(contentDir, "site.json"), "utf8"));
  const parsed = siteConfigSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(`[콘텐츠 오류] site.json\n${formatIssues(parsed.error)}`);
  }
  return parsed.data;
}

export const getProducts = () => loadCatalog("products") as Product[];
export const getServices = () => loadCatalog("services") as Service[];
export const getReviews = () => loadReviews();
export const getEvents = () => loadEvents();
export const getSiteConfig = () => loadSiteConfig();
