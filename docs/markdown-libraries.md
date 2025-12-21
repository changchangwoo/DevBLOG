# 마크다운 처리 라이브러리 가이드

## 전체 처리 흐름

```
Markdown 파일 (.md)
    ↓
[gray-matter] → Front Matter 파싱
    ↓
[remark] → Markdown AST 생성
    ↓
[remark-gfm] → GitHub Flavored Markdown 확장
    ↓
[remark-rehype] → Markdown AST → HTML AST 변환
    ↓
[rehype-slug] → 헤딩에 ID 추가
    ↓
[rehype-autolink-headings] → 헤딩에 링크 추가
    ↓
[rehype-highlight] → 코드 블록 신택스 하이라이팅
    ↓
[rehype-stringify] → HTML 문자열로 변환
    ↓
HTML 출력
```

---

## 라이브러리 상세 설명

### 1. gray-matter

**역할**: Front Matter (메타데이터) 파싱

**기능**:
- Markdown 파일 상단의 `---`로 감싸진 YAML 메타데이터 추출
- 메타데이터와 본문 콘텐츠를 분리

**예시**:
```javascript
import matter from 'gray-matter';

const fileContent = `---
title: "블로그 포스트"
date: "2024-01-30"
---
# 본문 내용
`;

const { data, content } = matter(fileContent);
// data: { title: "블로그 포스트", date: "2024-01-30" }
// content: "# 본문 내용"
```

**사용 위치**: `lib/posts.ts` → `getPostBySlug()` 함수

---

### 2. remark

**역할**: Markdown 파서 (코어 라이브러리)

**기능**:
- Markdown 텍스트를 추상 구문 트리(AST)로 변환
- 플러그인 생태계의 기반
- unified 프로세서의 Markdown 버전

**특징**:
- AST를 통해 Markdown 구조를 프로그래밍적으로 조작 가능
- 다양한 플러그인을 통해 기능 확장

**내부 처리**:
```
"# Hello"
    ↓
{
  type: 'heading',
  depth: 1,
  children: [{ type: 'text', value: 'Hello' }]
}
```

---

### 3. remark-gfm

**역할**: GitHub Flavored Markdown 지원

**기능**:
- 표준 Markdown에 GitHub 확장 기능 추가
- 테이블, 취소선, 태스크 리스트, 자동 링크 등 지원

**지원 기능**:

1. **테이블**
```markdown
| 헤더1 | 헤더2 |
|------|------|
| 내용1 | 내용2 |
```

2. **체크박스 (Task List)**
```markdown
- [x] 완료된 작업
- [ ] 진행 중 작업
```

3. **취소선**
```markdown
~~삭제된 텍스트~~
```

4. **자동 링크**
```markdown
https://example.com → 자동으로 링크 변환
```

**사용하지 않으면**: 위 기능들이 일반 텍스트로 렌더링됨

---

### 4. remark-rehype

**역할**: Markdown AST → HTML AST 변환 (브릿지)

**기능**:
- remark(Markdown) 생태계에서 rehype(HTML) 생태계로 전환
- Markdown을 HTML로 변환하기 위한 필수 단계

**처리 과정**:
```
Markdown AST (mdast)
{
  type: 'heading',
  depth: 1,
  children: [...]
}
    ↓ remark-rehype
HTML AST (hast)
{
  type: 'element',
  tagName: 'h1',
  children: [...]
}
```

**옵션**:
- `allowDangerousHtml: true` - HTML 태그를 그대로 유지 (sanitize 하지 않음)

---

### 5. rehype-slug

**역할**: 헤딩 요소에 자동으로 ID 생성

**기능**:
- 모든 헤딩(`<h1>`, `<h2>`, `<h3>` 등)에 고유한 ID 속성 추가
- ID는 헤딩 텍스트를 기반으로 자동 생성 (slugify)

**변환 예시**:
```markdown
## TypeScript 개발 팁
```
↓
```html
<h2 id="typescript-개발-팁">TypeScript 개발 팁</h2>
```

**용도**:
- 목차(Table of Contents) 생성
- 특정 섹션으로 직접 링크 (`/post#typescript-개발-팁`)
- rehype-autolink-headings의 기반

---

### 6. rehype-autolink-headings

**역할**: 헤딩을 클릭 가능한 앵커 링크로 변환

**기능**:
- 헤딩 요소를 `<a>` 태그로 감싸거나 링크 추가
- 헤딩 클릭 시 해당 섹션으로 직접 이동 가능

**옵션**:
```javascript
.use(rehypeAutolinkHeadings, {
  behavior: "wrap",  // 헤딩 전체를 링크로 감싸기
  properties: {
    className: ["heading-link"],  // CSS 클래스 추가
  },
})
```

**변환 예시**:
```html
<!-- Before -->
<h2 id="typescript-개발-팁">TypeScript 개발 팁</h2>

<!-- After (behavior: "wrap") -->
<h2 id="typescript-개발-팁">
  <a href="#typescript-개발-팁" class="heading-link">
    TypeScript 개발 팁
  </a>
</h2>
```

**behavior 옵션**:
- `wrap` - 헤딩 전체를 링크로 감싸기 (우리가 사용)
- `before` - 헤딩 앞에 링크 아이콘 추가
- `after` - 헤딩 뒤에 링크 아이콘 추가

---

### 7. rehype-highlight

**역할**: 코드 블록 신택스 하이라이팅

**기능**:
- `highlight.js`를 사용하여 코드 블록에 색상 강조 적용
- 언어 자동 감지 또는 명시적 언어 지정 지원
- 코드에 적절한 CSS 클래스 추가

**처리 과정**:
```markdown
```javascript
const hello = "world";
```
```
↓
```html
<pre><code class="hljs language-javascript">
  <span class="hljs-keyword">const</span>
  <span class="hljs-variable">hello</span> =
  <span class="hljs-string">"world"</span>;
</code></pre>
```

**지원 언어**: 180개 이상 (JavaScript, TypeScript, Python, Java, C++, Rust, Go 등)

**CSS 적용**:
- `highlight.js/styles/github.css` - 라이트 모드
- `app/globals.css`의 커스텀 스타일 - 다크 모드

---

### 8. rehype-stringify

**역할**: HTML AST → HTML 문자열 변환 (최종 출력)

**기능**:
- HTML AST를 실제 HTML 문자열로 직렬화
- 최종적으로 브라우저가 렌더링할 수 있는 HTML 생성

**처리 과정**:
```
HTML AST
{
  type: 'element',
  tagName: 'h1',
  children: [{ type: 'text', value: 'Hello' }]
}
    ↓ rehype-stringify
HTML String
"<h1>Hello</h1>"
```

**옵션**:
- `allowDangerousHtml: true` - HTML 태그를 이스케이프하지 않음

---

### 9. highlight.js

**역할**: 코드 하이라이팅 CSS 테마 제공

**기능**:
- 다양한 프리셋 테마 제공 (GitHub, Monokai, VS Code 등)
- rehype-highlight가 추가한 CSS 클래스에 실제 색상 적용

**사용 테마**:
- `highlight.js/styles/github.css` - GitHub 스타일 (라이트 모드)
- 커스텀 다크 모드 스타일 - `app/globals.css`에 정의

**테마 파일 위치**: `app/layout.tsx`에서 import
```typescript
import "highlight.js/styles/github.css";
```

---

## 실제 코드 예시 (lib/posts.ts)

```typescript
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)                    // 1. GFM 확장 (테이블, 체크박스)
    .use(remarkRehype, {               // 2. Markdown → HTML AST 변환
      allowDangerousHtml: true
    })
    .use(rehypeSlug)                   // 3. 헤딩에 ID 추가
    .use(rehypeAutolinkHeadings, {     // 4. 헤딩을 링크로 변환
      behavior: "wrap",
      properties: { className: ["heading-link"] },
    })
    .use(rehypeHighlight)              // 5. 코드 블록 하이라이팅
    .use(rehypeStringify, {            // 6. HTML 문자열로 변환
      allowDangerousHtml: true
    })
    .process(markdown);

  return result.toString();
}
```

---

## 파이프라인 실제 예시

### 입력 (Markdown)
```markdown
---
title: "테스트 포스트"
date: "2024-01-30"
---

## 코드 예시

```javascript
const hello = "world";
```

| 언어 | 타입 |
|------|------|
| JS   | 동적 |

- [x] 완료
- [ ] 진행 중
```

### 처리 단계

1. **gray-matter** 처리
```javascript
{
  data: { title: "테스트 포스트", date: "2024-01-30" },
  content: "## 코드 예시\n\n```javascript..."
}
```

2. **remark** → Markdown AST 생성
3. **remark-gfm** → 테이블, 체크박스 파싱
4. **remark-rehype** → HTML AST 변환
5. **rehype-slug** → `<h2 id="코드-예시">`
6. **rehype-autolink-headings** → `<a href="#코드-예시">` 추가
7. **rehype-highlight** → 코드에 `hljs` 클래스 추가
8. **rehype-stringify** → 최종 HTML 문자열

### 출력 (HTML)
```html
<h2 id="코드-예시">
  <a href="#코드-예시" class="heading-link">코드 예시</a>
</h2>

<pre><code class="hljs language-javascript">
  <span class="hljs-keyword">const</span>
  <span class="hljs-variable">hello</span> =
  <span class="hljs-string">"world"</span>;
</code></pre>

<table>
  <thead><tr><th>언어</th><th>타입</th></tr></thead>
  <tbody><tr><td>JS</td><td>동적</td></tr></tbody>
</table>

<ul>
  <li><input type="checkbox" checked disabled> 완료</li>
  <li><input type="checkbox" disabled> 진행 중</li>
</ul>
```

---

## 각 라이브러리가 없으면 어떻게 되나?

| 라이브러리 | 없으면 발생하는 문제 |
|-----------|-------------------|
| **gray-matter** | Front Matter를 파싱할 수 없음, 메타데이터 추출 불가 |
| **remark** | Markdown 파싱 불가, 전체 파이프라인 동작 안 함 |
| **remark-gfm** | 테이블, 체크박스, 취소선이 일반 텍스트로 표시됨 |
| **remark-rehype** | HTML 변환 불가, 파이프라인 중단 |
| **rehype-slug** | 헤딩에 ID가 없어 앵커 링크 불가능 |
| **rehype-autolink-headings** | 헤딩 클릭해도 이동 불가, 목차 기능 구현 어려움 |
| **rehype-highlight** | 코드가 단순 텍스트로 표시, 색상 강조 없음 |
| **rehype-stringify** | HTML 문자열 생성 불가, 파이프라인 중단 |
| **highlight.js** | 코드 색상 스타일이 적용되지 않음 |

---

## 대안 라이브러리

### 기존 방식 (제거한 라이브러리)
- **remark-html**: remark에서 직접 HTML로 변환
  - 제거 이유: rehype 플러그인 사용 불가, 기능 제한적

### 다른 선택지
- **marked**: 간단한 Markdown 파서, 플러그인 생태계가 작음
- **markdown-it**: 빠른 파서, 플러그인 많지만 API가 다름
- **MDX**: React 컴포넌트 임베딩 가능, 더 복잡한 설정 필요

### 우리가 unified 생태계를 선택한 이유
- 플러그인이 가장 풍부함
- 표준화된 AST 사용
- 세밀한 제어 가능
- Next.js 공식 예제에서 사용

---

## 성능 고려사항

- **빌드 타임 처리**: 모든 Markdown → HTML 변환은 빌드 시 발생
- **런타임 영향 없음**: 정적으로 생성된 HTML만 전송
- **번들 크기**: highlight.js CSS만 클라이언트로 전송 (약 10KB)
- **SSG 최적화**: 한 번 변환된 HTML은 재사용

---

## 결론

이 라이브러리 조합은 **벨로그 수준의 전문적인 마크다운 렌더링**을 제공하며, Next.js SSG 아키텍처와 완벽하게 통합됩니다.

핵심 장점:
✅ GitHub Flavored Markdown 완전 지원
✅ 자동 코드 신택스 하이라이팅
✅ 헤딩 앵커 링크로 섹션 이동 가능
✅ 테이블, 체크박스 등 풍부한 기능
✅ 다크 모드 완벽 지원
✅ 빌드 타임 처리로 런타임 성능 우수
