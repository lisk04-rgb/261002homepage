import type { z } from "zod";
import type {
  catalogFrontmatterSchema,
  reviewSchema,
  siteConfigSchema,
} from "@/lib/schemas";

export type CatalogKind = "products" | "services";

/** MDX 파일 맨 위(frontmatter)에 적는 정보 */
export type CatalogFrontmatter = z.infer<typeof catalogFrontmatterSchema>;

/** 상품·서비스 공통 데이터. description은 MDX 본문 문자열이다. */
export type CatalogItem = CatalogFrontmatter & {
  kind: CatalogKind;
  slug: string;
  description: string;
};

export type Product = CatalogItem & { kind: "products" };
export type Service = CatalogItem & { kind: "services" };

/** 목록 화면에 내려보내는 요약 데이터(본문 제외로 페이지 용량을 줄인다) */
export type CatalogSummary = Omit<CatalogItem, "description">;

export type Review = z.infer<typeof reviewSchema> & { id: string };

export type SiteConfig = z.infer<typeof siteConfigSchema>;

export type SortKey = "featured" | "title" | "price-asc" | "price-desc";
