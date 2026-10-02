# 내집마련 코칭 홈페이지

내집마련 1대1 컨설팅과 4주 코칭을 소개하고, 문의·일정 확인·과제 제출을 받는 한국어 웹사이트입니다. (Next.js 15 + TypeScript + Tailwind CSS + Firebase)

## 정해 둔 가정 (실제 내용으로 바꿔 주세요)
- 사이트 이름 **"내집마련 코칭"**, 한 줄 소개 등은 임시 문구입니다 → `content/site.json`
- 서비스 2개: 내집마련 1대1 컨설팅, 내집마련 4주 코칭. **가격은 "문의 후 안내"**, 설명·4주 구성은 초안입니다 → `content/services/*.mdx`
- 후기는 실제 후기가 없어 **비워 두었습니다**(`content/reviews/_example.json` 참고). 일정 3개는 **"(샘플 일정)"** 입니다 → `content/events/`
- 상품(`content/products/`)이 하나도 없으면 "상품" 메뉴는 자동으로 숨겨집니다.
- 투자 권유가 아니라는 안내 문구를 푸터와 서비스 상세에 넣었습니다 → `site.json`의 `disclaimer`. 서비스 성격에 따라 필요한 신고·고지(예: 유사투자자문업)는 직접 확인해 주세요.
- 이미지는 SVG 플레이스홀더입니다. 실제 사진으로 교체 필요
- 사업자 정보·연락처는 `[상호명]` 같은 자리표시자
- 추가 라이브러리: `gray-matter`, `next-mdx-remote`(MDX), `zod`(검증), `firebase`(요청에 따라 추가)
- `/contact`는 Phase 1 임시 페이지(연락처만 표시). Phase 2에서 문의 폼으로 교체

## 처음 실행하기
1. [Node.js](https://nodejs.org) 20 이상(LTS)을 설치합니다.
2. 이 폴더에서 터미널을 열고 `npm install` 을 실행합니다.
3. `npm run dev` 실행 후 브라우저에서 http://localhost:3000 을 엽니다.

## 내용 수정하는 법 (코드 수정 없음)
### 서비스(또는 상품) 추가·수정
1. `content/products/_template.mdx`를 복사해 `content/services/`(서비스) 또는 `content/products/`(상품)에 넣고 파일 이름을 영문 소문자·숫자·하이픈으로 바꿉니다. 예: `blue-plan.mdx` → 주소 `/services/blue-plan`
2. 맨 위 `---` 사이의 칸을 채웁니다. `price`는 쉼표 없이 숫자만(줄을 지우면 "문의 후 안내"), `images`는 `public/images/`에 넣은 사진 경로, `featured: true`면 홈에 노출
3. 아래에 상세 설명을 씁니다(`**굵게**`, `- 목록`, `## 소제목`). 잘못 적으면 어떤 파일의 어떤 칸인지 한국어로 알려 줍니다.

### 일정(캘린더) 추가
`content/events/_example.json`을 복사해 새 파일로 만들고 내용을 고칩니다. `type`은 `launch`(런칭) / `start`(시작) / `recruit`(모집) / `deadline`(마감) / `event`(행사), 기간이 있으면 `endDate`도 적습니다. 지난 일정은 홈의 "다가오는 일정"에서 자동으로 빠집니다.

### 후기 추가
`content/reviews/_example.json`을 복사해 고칩니다. `target`에 `"services/home-buying-4week-coaching"`처럼 대상을 적습니다. `_`로 시작하는 파일은 사이트에 나오지 않습니다.

### 사이트 이름·문구·연락처·사업자 정보
`content/site.json`

## 과제 제출 운영
- 회원이 `/assignments`에서 로그인 후 프로그램·주차·내용·첨부 링크를 제출합니다. **파일 업로드는 Firebase Storage가 Spark 요금제에서 새 프로젝트에 쓸 수 없어 지원하지 않고**, 구글 드라이브·노션 등 공유 링크로 받습니다.
- **확인**: Firebase 콘솔 → Firestore Database → `submissions` 컬렉션에서 전체 제출을 봅니다(`name`은 마스킹된 이름, `uid`로 회원 구분).
- **피드백**: 해당 문서에 `feedback`(문자열) 필드를 추가하면 회원의 "제출 내역"에 "코치 피드백"으로 표시됩니다.
- 제출한 본인과 운영자(콘솔)만 볼 수 있고, 제출 후 수정은 불가(재제출/삭제만)합니다. 수강생 여부는 확인하지 않습니다.

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
- **찜하기**: 서비스(상품) 상세에서 ♡ 버튼 → 마이페이지 "찜 목록" (Firestore `users/{uid}/wishlist`)
- **회원 후기**: 로그인한 회원이 상세 페이지에서 작성 → **승인 대기** → 관리자가 승인하면 공개 (Firestore `reviews`). 파일 후기(`content/reviews`)와 함께 표시
- **게시판(`/board`)**: 로그인한 회원이 글·댓글 작성, 본인 글·댓글 수정/삭제(글쓴이는 자기 글의 댓글도 삭제 가능). 읽기는 누구나. 부적절한 글은 Firebase 콘솔 → Firestore → `posts` 문서를 삭제해 관리
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
