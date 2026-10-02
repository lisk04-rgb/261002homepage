# CLAUDE.md

## 기술 스택
- Next.js 15 (App Router) + TypeScript strict + Tailwind CSS v4 (`src/app/globals.css`의 `@theme`에 팔레트 정의)
- 콘텐츠: `content/` 폴더의 MDX/JSON (DB 없음, Phase 1~2). gray-matter로 frontmatter 파싱, zod로 검증, next-mdx-remote/rsc로 렌더링
- 테스트: Vitest (`src/**/*.test.ts`)
- 배포: Vercel (플랫폼 전용 기능 사용 금지 → Netlify 이전 가능 유지)

## 폴더 구조
```
content/            상품(products/*.mdx), 서비스(services/*.mdx), 후기(reviews/*.json), 사이트 정보(site.json)
public/images/      이미지 (현재 SVG 플레이스홀더)
src/app/            라우트 (/, /products, /products/[slug], /services, /services/[slug], /about, /contact)
src/components/     UI 컴포넌트 (kebab-case 파일, PascalCase 컴포넌트)
src/lib/            content.ts(로딩·검증), schemas.ts(zod), catalog.ts(필터·정렬·추천), format.ts, site.ts
src/types/          content.ts (스키마에서 타입 추론)
```

## 컨벤션
- 컴포넌트 PascalCase, 함수·변수 camelCase, 파일 kebab-case
- 사용자 노출 문구는 한국어, 주석은 "왜"가 필요한 곳에만 한국어로
- 이미지는 `next/image`, 시맨틱 태그·alt·포커스 스타일 유지
- 콘텐츠 스키마 변경 시 `src/lib/schemas.ts` → 타입은 자동 추론. `content/products/_template.mdx`와 README도 갱신
- 요청 없는 라이브러리 추가 금지

## 명령어
- `npm run dev` 개발 서버 / `npm run build` 빌드 / `npm start` 빌드 결과 실행
- `npm run lint` / `npm run typecheck` / `npm test`
