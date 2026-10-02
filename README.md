# 온결 공방 홈페이지

상품과 서비스를 소개하고 문의를 받는 한국어 웹사이트입니다. (Next.js 15 + TypeScript + Tailwind CSS)

## 정해 둔 가정 (답변이 없어 기본값으로 진행)
- 브랜드명: **온결 공방** (가상), 한 줄 소개 "일상에 온기를 더하는 핸드메이드 리빙"
- 상품 3개(도자기 머그, 린넨 매트, 소이 캔들) / 서비스 2개(원데이 클래스, 맞춤 제작 상담)
- 주요 방문자: 25~45세, 집 꾸미기·선물에 관심 있는 직장인과 신혼부부
- 분위기: 따뜻하고 신뢰감 있는 미니멀 / 색상: 네이비 `#1F2A44` + 베이지 `#F3EDE3` + 테라코타 `#B8572F`
- 이미지: 직접 만든 SVG 플레이스홀더 (저작권 문제 없음). 실제 사진으로 교체 필요
- 사업자 정보·연락처는 `[상호명]` 같은 자리표시자로 둠
- 추가 라이브러리: `gray-matter`, `next-mdx-remote`(MDX 처리), `zod`(콘텐츠 검증, Phase 2 폼 검증에도 사용)
- `/contact`는 Phase 1에서 연락처만 보여주는 임시 페이지 (Phase 2에서 문의 폼으로 교체)

## 처음 실행하기
1. [Node.js](https://nodejs.org) 20 이상(LTS)을 설치합니다.
2. 이 폴더에서 터미널을 열고 `npm install` 을 실행합니다.
3. `npm run dev` 실행 후 브라우저에서 http://localhost:3000 을 엽니다.

## 상품 추가하는 법 (코드 수정 없음)
1. `content/products/_template.mdx` 파일을 복사합니다.
2. 파일 이름을 영문 소문자·숫자·하이픈으로 바꿉니다. 예: `blue-plate.mdx` → 주소는 `/products/blue-plate`
3. 맨 위 `---` 사이의 칸을 채웁니다.
   - `price`: 쉼표 없이 숫자만 (`39000`). 줄을 지우면 "문의 후 안내"로 표시
   - `images`: 사진을 `public/images/products/`에 넣고 `/images/products/사진이름.jpg`로 적기. 첫 번째 사진이 대표 이미지
   - `featured: true`면 홈 "추천"에 노출, `order`가 작을수록 앞에 표시
4. 아래 `---` 다음 줄부터 상세 설명을 자유롭게 씁니다 (`**굵게**`, `- 목록`, `## 소제목`).
5. 저장하면 개발 서버에 바로 반영됩니다. 잘못 적은 칸이 있으면 화면/터미널에 **어떤 파일의 어떤 칸**이 틀렸는지 한국어로 나옵니다.

- **서비스**는 같은 방법으로 `content/services/` 에 추가합니다.
- **후기**는 `content/reviews/` 의 JSON 파일을 복사해 고칩니다. `target`에 `"products/ceramic-mug"`처럼 대상을 적고, `featured: true`면 홈에 나옵니다.
- **사이트 이름·문구·연락처·사업자 정보**는 `content/site.json` 에서 바꿉니다.
- 수정·삭제는 해당 파일을 고치거나 지우면 됩니다.

## 배포하는 법 (Vercel)
1. 이 저장소를 GitHub에 올립니다 (이미 올라가 있음).
2. https://vercel.com 에 GitHub 계정으로 로그인 → **Add New → Project** → 이 저장소 **Import**.
3. 설정은 기본값 그대로 두고, **Environment Variables**에 아래 환경변수를 넣은 뒤 **Deploy**.
4. 이후 GitHub에 변경 사항이 올라가면 자동으로 다시 배포됩니다.

Netlify로 옮길 때: Netlify에서 저장소를 Import하면 Next.js를 자동 인식합니다(빌드 명령 `npm run build`). 환경변수만 똑같이 넣어 주세요.

## 환경변수 목록
`.env.example`을 복사해 `.env.local`을 만들고 값을 채웁니다. (`.env.local`은 GitHub에 올라가지 않습니다)

| 이름 | 필수 | 설명 |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | 배포 시 | 사이트 실제 주소. 예: `https://example.com` (끝에 `/` 없이) |

Phase 2에서 문의 메일(Resend)·카카오톡 채널 관련 변수가 추가됩니다.

## 개발자용 명령어
`npm run lint` · `npm run typecheck` · `npm test` · `npm run build`
