# DevBLOG 개발 지침서

## 목적

- Next.js 기반 개발 블로그 구축
- Markdown 기반 포스팅 관리
- 정적 생성(SSG)을 전제로 한 저비용 아키텍처 유지
- 댓글은 Giscus(GitHub Discussions)로 외부 위임

---

## 기본 원칙 (중요)

1. **모든 페이지는 빌드 타임에 정적 생성한다**

   - Server Actions, Edge Functions, ISR은 사용하지 않는다
   - `searchParams`에 의존하는 페이지를 만들지 않는다 (동적 렌더링이 된다)
   - 필터·페이지네이션은 **URL 경로 세그먼트**로 표현한다
   - 모든 동적 라우트에 `export const dynamicParams = false`를 선언한다

2. **콘텐츠는 Markdown 파일로 관리한다**

   - Git 기반 포스팅 관리, Front Matter로 메타데이터 구조화

3. **런타임 서버 의존 기능을 추가하지 않는다**
   - Next.js API Route는 정적 파일 생성 용도로만 사용한다
     (`feed.xml`, `search-index.json` — 모두 `dynamic = "force-static"`)

---

## 개발 명령어

```bash
pnpm dev      # 개발 서버 (http://localhost:3000)
pnpm build    # 프로덕션 빌드
pnpm start    # 프로덕션 서버
pnpm lint     # ESLint
```

빌드 결과의 라우트 표기에서 **`ƒ (Dynamic)`이 하나라도 보이면 원칙 위반**이다.
현재는 전부 `○ (Static)` / `● (SSG)` 상태를 유지하고 있다.

---

## 프로젝트 구조

```
DevBLOG/
├── _posts/{category}/{slug}.md      # 블로그 포스트
├── _til/{year}/{YYYY-MM-DD}.md      # TIL
├── app/
│   ├── layout.tsx                   # 루트 레이아웃 (metadata, ThemeProvider, Header, Footer)
│   ├── [[...page]]/page.tsx         # 홈 + 페이지네이션 (/, /2, /3 …)
│   ├── posts/[[...filter]]/page.tsx # 필터 목록 (아래 URL 규칙 참고)
│   ├── post/[...slug]/page.tsx      # 포스트 상세
│   ├── til/[[...year]]/             # TIL (page.tsx, TILPageClient.tsx, TILDetail.tsx)
│   ├── about/page.tsx
│   ├── not-found.tsx / error.tsx
│   ├── sitemap.ts / robots.ts
│   ├── feed.xml/route.ts            # RSS (force-static)
│   ├── search-index.json/route.ts   # 검색 인덱스 (force-static)
│   └── globals.css
├── components/
│   ├── common/                      # Badge, CategoryList, Divider, Footer, IconWithLabel,
│   │   │                            # MainProfile, PostCard, SearchModal
│   │   └── Header/                  # Header, HeaderDesktop, HeaderMobile, config.tsx
│   ├── context/ThemeProvider.tsx
│   ├── home/PinnedPost.tsx
│   ├── layout/PageLayout.tsx
│   ├── post-detail/                 # Giscus, ScrollProgressBar, TableOfContents
│   ├── posts/Pagination.tsx
│   └── til/TILCalendar.tsx
├── lib/
│   ├── markdown.ts                  # 마크다운 → HTML + 목차 수집 (단일 파이프라인)
│   ├── posts.ts                     # 포스트 조회/집계/페이지네이션
│   ├── til.ts                       # TIL 조회
│   ├── filter.ts / category.ts / jsonld.ts / utils.ts
│   └── rehype-callout.ts / rehype-heading-divider.ts
└── constant/const.ts                # SITE_URL, PINNED_POST_SLUG, CATEGORY_MAP, AUTHOR_INFO
```

### 기술 스택

Next.js 16.1 (App Router) · React 19.2 · TypeScript 5 (strict) · Tailwind CSS 4 · pnpm

마크다운: `gray-matter`, `remark`, `remark-gfm`, `remark-rehype`,
`rehype-slug`, `rehype-highlight`, `rehype-stringify`, `unist-util-visit`

테마: `next-themes` (`attribute="class"`, `defaultTheme="dark"`, `enableSystem={false}`)

---

## URL 규칙

| URL | 의미 |
| --- | --- |
| `/`, `/2`, `/3` | 홈 (전체 포스트, 6개씩) |
| `/post/{category}/{slug}` | 포스트 상세 |
| `/posts` | 전체 목록 |
| `/posts/2` | 전체 목록 2페이지 |
| `/posts/category/{category}` | 카테고리 필터 |
| `/posts/category/{category}/2` | 카테고리 필터 2페이지 |
| `/posts/tag/{tag}` | 태그 필터 |
| `/til` | TIL (가장 최근 기록이 있는 연도) |
| `/til/{year}` | 특정 연도 TIL |

**1페이지는 접미사 없는 정규 URL만 사용한다.** `/posts/1`은 404다 (중복 콘텐츠 방지).

`/til`과 `/til/{기본연도}`는 같은 내용이며, 후자의 canonical은 `/til`을 가리킨다.

이전에 쓰이던 쿼리 기반 URL(`/posts?category=`, `/posts?tag=`, `/posts?page=`, `/til?year=`)은
**`proxy.ts`**에서 308로 새 경로에 연결된다.
`next.config.ts`의 `redirects()`를 쓰면 안 된다 — Next가 매칭된 쿼리 값을
**디코딩한 채 `Location` 헤더에 넣어** 한글·공백이 든 태그에서
`ERR_INVALID_CHAR`로 500이 난다. `URL` 객체는 인코딩을 알아서 처리한다.

### 한글·공백이 들어간 세그먼트 주의

`generateStaticParams`는 **원본 문자열을 그대로** 반환해야 한다.
미리 `encodeURIComponent`를 적용하면 정적 경로 매칭이 깨져 404가 된다.
반대로 런타임 세그먼트는 인코딩된 채로 들어올 수 있으므로,
페이지 쪽에서 `decodeURIComponent`를 방어적으로 적용한다
(`app/posts/[[...filter]]/page.tsx`의 `safeDecode` 참고).

---

## 데이터 계층

### `lib/posts.ts`

모든 조회 함수는 **React `cache()`로 감싸져 있다.** 이는 선택이 아니라 필수다.
헤더·사이드바·페이지가 각각 조회하므로, 캐시가 없으면 페이지 한 장을 그리는 데
`_posts` 전체를 대여섯 번 다시 읽는다.

```ts
getPostSlugs()        // 슬러그 목록
getPostBySlug(slug)   // Post | null  (없으면 throw가 아니라 null)
getAllPosts()         // PostSummary[] (날짜 내림차순)
getAllTag()           // Tag[]      (빈도순)
getAllCategories()    // Category[] (빈도순)
getPinnedPost()       // PostSummary | null
getTotalPages(n) / getPostsByPage(posts, page)   // POSTS_PER_PAGE = 6
```

타입은 두 가지다.

- `PostSummary` — 목록/카드/검색용 최소 메타데이터
- `Post extends PostSummary` — `content` 포함 (상세 페이지 전용)

Node.js `fs`를 쓰므로 **Server Component에서만 호출 가능**하다.

### `lib/markdown.ts`

마크다운 파이프라인은 **이 파일 하나뿐이다.** posts와 til이 함께 쓴다.

```ts
renderMarkdown(md, { category, collectHeadings })  // → { html, headings }
markdownToHtml(md, category)                       // → html (목차 불필요할 때)
```

목차(`headings`)는 `rehype-slug`가 부여한 id를 파이프라인 안에서 수집한다.
**별도 정규식으로 heading을 다시 파싱하지 말 것** — id 생성 규칙이 어긋나
목차 링크가 조용히 깨진다(실제로 그런 버그가 있었다).

### `lib/til.ts`

`posts.ts`와 같은 패턴. 조회 함수는 `cache()`로 감싸고,
HTML 변환은 `Promise.all`로 병렬 처리한다.

---

## Front Matter

**포스트** (`_posts/{category}/{slug}.md`)

```markdown
---
title: "포스트 제목"
description: "짧은 요약"
date: "2026-01-15"
tag: ["Next", "SEO"]
coverImage: "/images/posts/tech/slug/cover.png"
---
```

- `category`는 생략 시 디렉터리명에서 자동 추론된다
- `tag`는 URL 세그먼트가 되므로 신중히 정한다

**TIL** (`_til/{year}/{YYYY-MM-DD}.md`)

```markdown
---
date: 2026-01-15
title: "제목"
pinned: false
---

- bullet point 형식의 짧은 학습 메모
```

파일명은 반드시 `YYYY-MM-DD.md` (0 패딩 필수), 연도 디렉터리 아래에 둔다.

---

## 성능 관련 규칙

### 1. 블로그 데이터를 클라이언트 컴포넌트에 props로 넘기지 않는다

루트 레이아웃의 `Header`는 클라이언트 컴포넌트다. 여기에 포스트 목록을 넘기면
**모든 페이지의 RSC 페이로드에 전체 목록이 중복 직렬화된다.**

검색은 이 문제를 이렇게 피한다.

```
app/search-index.json/route.ts  (force-static, 빌드 시 1회 생성)
        ↓ 모달을 처음 열 때만 fetch
components/common/SearchModal.tsx  (next/dynamic 으로 지연 로드)
```

### 2. 스크롤 핸들러에서 state를 쓰지 않는다

스크롤 위치는 렌더링에 쓰이지 않으므로 `useRef`에 담고 `requestAnimationFrame`으로
스로틀한다. state로 두면 프레임마다 리렌더 + 리스너 재등록이 일어난다.
`Header.tsx`, `ScrollProgressBar.tsx`가 이 패턴을 따른다.

### 3. `useEffect` 안에서 `setState`를 호출하지 않는다

ESLint `react-hooks/set-state-in-effect`가 에러로 잡는다.
파생 가능한 값은 렌더링 시점에 계산한다
(예: `HeaderMobile`의 `isMenuOpen = isMenuRequested && isVisible`).

### 4. 이미지

**루트 `font-size: 62.5%`이므로 1rem = 10px다.** `max-w-7xl`은 1280px이 아니라 **800px**이다.
`sizes`를 쓸 때 이걸 잊으면 실제 필요량의 2배를 내려받는다.

| 위치 | 실제 폭 | `sizes` |
| --- | --- | --- |
| 포스트 본문 | 760px | `(min-width: 800px) 760px, calc(100vw - 40px)` |
| 상세 커버 | 800px | `(min-width: 800px) 800px, 100vw` |
| PostCard | ~420px (2단) | `(min-width: 1280px) 420px, 50vw` |
| PinnedPost | ~860px | `(min-width: 1280px) 860px, calc(100vw - 40px)` |

- `fill`을 쓰면 **반드시 `sizes`를 준다** (없으면 원본 크기를 내려받는다)
- LCP 요소(상단 커버 이미지)에는 `priority`를 준다
- **`width`/`height`에 임의의 값을 넣지 않는다.** 로드 전 예약 높이가 여기서 나오므로
  실제 비율과 다르면 이미지가 뜨는 순간 레이아웃이 밀린다.
  커버는 `getImageMeta()`로 원본 크기를 읽어 그대로 넘긴다
  (`2400x180`으로 고정돼 있던 시절 상세 페이지 상단이 271px 밀렸다)

**본문 마크다운 이미지는 `next/image`를 쓸 수 없다.** HTML 문자열로 렌더되기 때문이다.
대신 `lib/rehype-image.ts`가 빌드 타임에 `<img>`를 다시 쓴다.

```
<img src="/images/…">
  ↓
<img src="/_next/image?…" srcset="…" sizes="…"
     width height              ← 원본에서 읽어 CLS 제거
     loading="lazy" decoding="async"
     style="background-image:url(data:image/webp;base64,…)">  ← 블러
```

블러는 `background-image`로 심는다. 12px WebP 썸네일이라 페이지당 약 2KB다.

다만 배경만으로는 부족하다. 브라우저는 이미지를 **내려받는 대로 위에서부터 그려 넣어서**
블러 위로 조금씩 채워지는 모습이 보인다. 그래서 `components/post-detail/ImageReveal.tsx`가
로드 완료 시 `.is-loaded`를 붙이고, CSS가 그때 `opacity`를 올려 한 번에 전환한다.
JS가 없을 때를 위해 상세 페이지에 `<noscript>` 스타일 폴백을 둔다.

본문 이미지의 srcset은 1200px로 상한을 둔다. 슬롯이 760px이라 약 1.6배면 충분하고,
상한이 없으면 고DPR 기기가 1920px를 받아 용량이 두 배가 된다.

커버 이미지는 `next/image`의 `placeholder="blur"`를 쓰며,
`blurDataURL`은 `lib/posts.ts`의 `getCoverBlur()` / `getCoverBlurMap()`으로 빌드 타임에 만든다.
**`PostSummary`에는 넣지 않는다** — `search-index.json`에 실려 페이로드가 커진다.

`/_next/image`가 허용하는 폭은 `next.config.ts`의 `deviceSizes`에 있는 값뿐이다.
임의의 폭을 넘기면 **400**이 나므로 `lib/image.ts`의 `snapWidth()`로 스냅한다.

`sharp`는 devDependency이며 빌드 타임에만 쓴다.
**버전을 Next 내장본과 맞춰야 한다** — 어긋나면 libvips가 이중 로드되어
"mysterious crashes" 경고가 뜬다.

---

## 스타일링

- Tailwind CSS 4 + `@tailwindcss/typography` (`app/globals.css`에서 `@plugin`으로 로드)
- 커스텀 `.prose` 스타일을 `globals.css`에서 추가로 덮어쓴다
- 색상은 `:root` / `.dark` CSS 변수 → `@theme`에 매핑해 Tailwind 유틸로 사용
- 타이포 유틸(`title1~3`, `body1~3`, `caption`)은 `@layer utilities`에 정의

다크 모드는 `next-themes`의 `class` 전략이다.
**테마 값에 의존하는 렌더링 대신 CSS `dark:` variant를 우선 사용한다** —
마운트 전후로 값이 달라져 깜박임이 생기는 것을 막는다.

---

## 알려진 제약

- `output: "export"`는 아직 적용하지 않았다. `next.config.ts`의 `redirects()`와
  `proxy.ts`가 Node 런타임을 필요로 하므로, 완전한 정적 배포로 가려면
  둘 다 CDN(CloudFront Function 등) 쪽으로 옮겨야 한다.
  페이지 자체는 전부 정적이므로 이 둘만 옮기면 된다.
- `app/about/page.tsx`는 아직 내용이 채워지지 않았다.
- 테스트 코드가 없다.
