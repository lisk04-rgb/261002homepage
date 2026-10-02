import { z } from "zod";

// 콘텐츠 파일을 잘못 적었을 때 빌드 단계에서 어떤 칸이 틀렸는지 한국어로 알려주기 위한 스키마
export const catalogFrontmatterSchema = z.object({
  title: z.string({ error: "title(이름)을 적어 주세요." }).min(1),
  summary: z.string({ error: "summary(한 줄 소개)를 적어 주세요." }).min(1),
  category: z.string({ error: "category(카테고리)를 적어 주세요." }).min(1),
  price: z
    .number({ error: "price(가격)는 쉼표 없이 숫자로만 적어 주세요. 예: 39000" })
    .int()
    .nonnegative()
    .optional(),
  images: z
    .array(z.string().startsWith("/", { error: "이미지 경로는 /images/... 처럼 /로 시작해야 해요." }))
    .min(1, { error: "images(이미지)를 1개 이상 적어 주세요." }),
  imageAlt: z.string().optional(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  order: z.number().default(100),
});

export const reviewSchema = z.object({
  name: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  content: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { error: "date는 2026-01-31 형식으로 적어 주세요." }),
  /** 후기 대상. 예: "products/ceramic-mug" */
  target: z
    .string()
    .regex(/^(products|services)\/[a-z0-9-]+$/)
    .optional(),
  featured: z.boolean().default(false),
});

export const EVENT_TYPES = ["launch", "start", "recruit", "deadline", "event"] as const;

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { error: "날짜는 2026-01-31 형식으로 적어 주세요." });

export const eventSchema = z
  .object({
    title: z.string().min(1, { error: "title(일정 이름)을 적어 주세요." }),
    date: isoDate,
    endDate: isoDate.optional(),
    type: z.enum(EVENT_TYPES, { error: "type은 launch, start, recruit, deadline, event 중 하나여야 해요." }),
    description: z.string().optional(),
    link: z.string().startsWith("/", { error: "link는 /services/... 처럼 /로 시작해야 해요." }).optional(),
  })
  .refine((event) => !event.endDate || event.endDate >= event.date, {
    error: "endDate는 date보다 같거나 늦어야 해요.",
    path: ["endDate"],
  });

export const siteConfigSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
  hero: z.object({
    eyebrow: z.string(),
    title: z.string(),
    subtitle: z.string(),
  }),
  contact: z.object({
    phone: z.string(),
    email: z.string(),
    hours: z.string(),
  }),
  business: z.object({
    companyName: z.string(),
    ceo: z.string(),
    registrationNumber: z.string(),
    address: z.string(),
  }),
  disclaimer: z.string(),
});
