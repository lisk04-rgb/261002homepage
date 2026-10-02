# 온결 공방 홈페이지

상품과 서비스를 소개하고 문의를 받는 한국어 웹사이트입니다. (Next.js 15 + TypeScript + Tailwind CSS)

## 정해 둔 가정 (답변이 없어 기본값으로 진행)
- 브랜드명: **온결 공방** (가상), 한 줄 소개 "일상에 온기를 더하는 핸드메이드 리빙"
- 상품 3개(도자기 머그, 린넨 매트, 소이 캔들) / 서비스 2개(원데이 클래스, 맞춤 제작 상담)
- 주요 방문자: 25~45세, 집 꾸미기·선물에 관심 있는 직장인과 신혼부부
- 분위기: 따뜻하고 신뢰감 있는 미니멀 / 색상: 네이비 `#1F2A44` + 베이지 `#F3EDE3` + 테라코타 `#B8572F`
- 이미지: 직접 만든 SVG 플레이스홀더 (저작권 문제 없음). 실제 사진으로 교체 필요
- 사업자 정보·연락처는 `[상호명]` 같은 자리표시자로 둠
- 추가 라이브러리: `gray-matter`, `next-mdx-remote`(MDX 처리), `zod`(콘텐츠·후기 검증, Phase 2 폼 검증에도 사용), `firebase`(요청에 따라 추가)
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

| `NEXT_PUBLIC_FIREBASE_API_KEY` 외 5개 | 선택 | Firebase 콘솔 → 프로젝트 설정 → 내 앱 → 웹 앱의 "구성" 값. `.env.example`의 이름 그대로 입력. **비워 두면 코드(`src/lib/firebase/config.ts`)에 들어 있는 기본값이 쓰임**. 다른 Firebase 프로젝트로 바꿀 때만 입력 |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | 선택 | `G-`로 시작하는 값. 있으면 방문 통계(Analytics)가 켜짐 |

Phase 2에서 문의 메일(Resend)·카카오톡 채널 관련 변수가 추가됩니다.

## Firebase 기능 (Spark 무료 요금제)
- **구글 로그인**: 헤더의 "로그인" / "마이페이지"
- **찜하기**: 상품·서비스 상세에서 ♡ 버튼 → 마이페이지 "찜 목록" (Firestore `users/{uid}/wishlist`)
- **회원 후기**: 로그인한 회원이 상세 페이지에서 작성 → **승인 대기** → 관리자가 승인하면 공개 (Firestore `reviews`). 파일 후기(`content/reviews`)와 함께 표시
- **방문 통계**: Google Analytics (Firebase 콘솔 → Analytics에서 확인)

### 처음 한 번 해야 할 설정
1. Firebase 콘솔 → **Firestore Database → 데이터베이스 만들기** (없다면). 위치는 `asia-northeast3`(서울) 권장
2. **규칙(Rules)** 탭에 저장소의 `firestore.rules` 내용을 그대로 붙여 넣고 **게시**
3. **인증 → 설정 → 승인된 도메인**에 배포 주소(`xxx.vercel.app`, 실제 도메인) 추가 (이미 하셨다면 생략)
4. (선택) 다른 Firebase 프로젝트를 쓸 때만 환경변수 입력. 기본값은 이미 코드에 들어 있어 배포 서비스에 따로 넣지 않아도 됩니다

### 후기 승인하는 법
Firebase 콘솔 → Firestore Database → `reviews` 컬렉션 → 문서를 열어 `status` 값을 `pending` → `approved`로 바꾸면 사이트에 공개됩니다. 공개하지 않을 후기는 `rejected`로 바꾸세요. (작성자 본인만 볼 수 있음)

### Spark 무료 한도 (참고)
Firestore 하루 읽기 5만·쓰기 2만 건, 저장 1GiB. 소규모 사이트에는 충분하며, 후기는 상세 페이지를 스크롤할 때만 읽어 사용량을 줄였습니다. Spark는 한도를 넘으면 결제 없이 **기능이 일시 중단**될 뿐 요금이 청구되지 않습니다.

## 개발자용 명령어
`npm run lint` · `npm run typecheck` · `npm test` · `npm run build`
