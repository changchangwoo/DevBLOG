# Next.js Blog Starter 개발 지침서

## 목적

- Next.js 기반 개발 블로그 구축
- Markdown 기반 포스팅 관리
- 정적 사이트로 빌드하여 S3 + CloudFront 배포
- 댓글/좋아요 등 인터랙션은 AWS Lambda(API Gateway)로 처리
- 장기적으로 광고 수익화를 고려한 저비용 아키텍처 유지

---

## 기본 원칙 (중요)

1. **Next.js는 정적 사이트 생성기(SSG)로만 사용한다**

   - Server Actions, Edge Functions, ISR은 사용하지 않는다
   - 런타임 서버 의존 기능을 추가하지 않는다

2. **콘텐츠는 Markdown(md / mdx) 파일로 관리한다**

   - Git 기반 포스팅 관리
   - Front Matter를 통해 메타데이터를 구조화한다

3. **백엔드 비즈니스 로직은 플랫폼 독립적으로 설계한다**
   - Next.js API는 사용하지 않거나 최소한의 어댑터 역할만 수행
   - 추후 AWS Lambda로 이전/확장이 가능해야 한다

---

## 개발 명령어

```bash
# 개발 서버 실행 (http://localhost:3000)
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start

# ESLint 실행
pnpm lint
```

---

## 프로젝트 구조

### 디렉토리 구조

```
DevBLOG/
├── _posts/              # Markdown 블로그 포스트 저장소
│   ├── hello-world.md
│   ├── nextjs-blog-architecture.md
│   └── typescript-tips.md
├── app/                 # Next.js App Router
│   ├── posts/[slug]/   # 동적 포스트 페이지
│   │   └── page.tsx
│   ├── layout.tsx      # 루트 레이아웃
│   ├── page.tsx        # 홈페이지 (포스트 목록)
│   └── globals.css     # 전역 스타일 + prose 스타일
├── lib/                # 유틸리티 함수
│   └── posts.ts        # Markdown 파싱 및 포스트 관리
└── public/             # 정적 파일 (이미지, SVG 등)
```

### 기술 스택

- **Next.js 16.1.0** (App Router, SSG)
- **React 19.2.3** (Server Components 기본)
- **TypeScript 5** (strict mode)
- **Tailwind CSS 4** (`@tailwindcss/postcss`)
- **pnpm** (패키지 매니저)
- **gray-matter** (Front Matter 파싱)
- **remark / remark-html** (Markdown → HTML 변환)

---

## 블로그 시스템 아키텍처

### 포스트 작성 흐름

1. `_posts/` 디렉토리에 `.md` 파일 생성
2. Front Matter로 메타데이터 정의 (title, excerpt, date, author)
3. Markdown으로 본문 작성
4. 빌드 시 `generateStaticParams()`로 모든 포스트 페이지를 정적 생성

### Front Matter 형식

```markdown
---
title: "포스트 제목"
excerpt: "짧은 요약"
date: "2024-01-15"
author:
  name: "작성자 이름"
coverImage: ""
---

# 본문 내용...
```

### 핵심 파일 설명

#### `lib/posts.ts`

Markdown 파일 읽기 및 파싱을 담당하는 유틸리티 모듈:

- `getPostSlugs()` - 모든 포스트의 슬러그 목록 반환
- `getPostBySlug(slug)` - 특정 포스트의 메타데이터 + 콘텐츠 반환
- `getAllPosts()` - 모든 포스트의 메타데이터 반환 (날짜 내림차순 정렬)
- `markdownToHtml(markdown)` - Markdown → HTML 변환

**중요**: 이 파일은 Node.js 파일 시스템 API(`fs`, `path`)를 사용하므로 Server Component에서만 호출 가능.

#### `app/page.tsx`

홈페이지 - 모든 블로그 포스트 목록 표시:

- `getAllPosts()`로 포스트 목록 가져오기
- 각 포스트 카드에 제목, 발췌, 날짜, 작성자 표시
- 클릭 시 `/posts/[slug]`로 이동

#### `app/posts/[slug]/page.tsx`

개별 포스트 페이지:

- `generateStaticParams()` - 빌드 시 모든 포스트 슬러그 생성
- `generateMetadata()` - 동적 메타데이터 (SEO)
- `getPostBySlug(slug)` - 포스트 데이터 로드
- `markdownToHtml()` - Markdown → HTML 변환
- `.prose` 클래스로 커스텀 타이포그래피 스타일 적용

---

## 스타일링

### Tailwind CSS 4 + 커스텀 Prose

- `app/globals.css`에 커스텀 `.prose` 스타일 정의
- `@tailwindcss/typography` 플러그인 **사용하지 않음** (Tailwind v4와 호환 문제)
- 대신 수동으로 prose 스타일을 구현하여 완전한 제어 가능

### CSS 변수 기반 테마

```css
:root {
  --background: #ffffff;
  --foreground: #171717;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}
```

### Geist 폰트

- `next/font/google`로 Geist Sans / Geist Mono 로드
- CSS 변수로 전역 적용: `--font-geist-sans`, `--font-geist-mono`

---

## 주요 개발 패턴

### 1. Server Components 우선

- App Router는 기본적으로 모든 컴포넌트가 Server Component
- `"use client"` 지시어는 상태/이벤트/브라우저 API가 필요한 경우에만 사용
- 파일 시스템 접근(`lib/posts.ts`)은 Server Component에서만 가능

### 2. Static Site Generation (SSG)

- `generateStaticParams()`를 사용해 빌드 타임에 모든 페이지를 미리 생성
- 런타임 서버 불필요 → S3 + CloudFront로 배포 가능
- **사용 금지**: Server Actions, ISR, Edge Functions

### 3. 타입 안정성

- TypeScript strict mode 활성화
- Props는 `Readonly<>` 타입 사용
- 인터페이스로 Post 메타데이터 구조 정의 (`lib/posts.ts` 참조)

### 4. 새 포스트 추가 방법

1. `_posts/new-post.md` 파일 생성
2. Front Matter 작성 (title, excerpt, date, author)
3. Markdown 본문 작성
4. `pnpm build` 실행 → 자동으로 정적 페이지 생성됨
5. Git commit 후 배포

---

## 참고사항

- **경로 별칭**: `@/*`는 프로젝트 루트를 가리킴 (`tsconfig.json`)
- **ESLint**: Next.js의 `core-web-vitals` + `typescript` 설정 사용
- **이미지**: `next/image` 컴포넌트 사용, `public/` 디렉토리에 저장
- **다크 모드**: `prefers-color-scheme` 미디어 쿼리로 자동 전환

---
