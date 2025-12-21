# 다크모드/라이트모드 전환 가이드

## 🎯 해결한 문제

### 문제점
- 다크모드 토글 버튼이 추가되었지만 클릭해도 테마가 변경되지 않았음
- CSS가 `@media (prefers-color-scheme: dark)`만 사용하여 시스템 설정만 따랐음
- `next-themes`의 class 기반 다크모드가 작동하지 않았음

### 원인
Tailwind CSS 4를 사용하면서:
1. `tailwind.config.ts` 파일이 없어 darkMode 설정이 없었음
2. CSS에서 미디어 쿼리만 사용하고 `.dark` 클래스를 사용하지 않았음

---

## ✅ 해결 방법

### 1. Tailwind 설정 파일 생성
```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // ← 핵심: class 기반 다크모드 활성화
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
```

**`darkMode: "class"`의 의미**:
- Tailwind의 `dark:` 유틸리티가 `.dark` 클래스를 감지
- `<html class="dark">`일 때 다크모드 스타일 적용
- `next-themes`가 이 클래스를 자동으로 추가/제거

---

### 2. CSS 변경: 미디어 쿼리 → 클래스 기반

#### ❌ 변경 전 (작동 안 함)
```css
@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

@media (prefers-color-scheme: dark) {
  .prose code {
    background-color: #27272a;
  }
}
```

#### ✅ 변경 후 (작동함)
```css
/* CSS 변수 */
.dark {
  --background: #0a0a0a;
  --foreground: #ededed;
}

/* Prose 스타일 */
.dark .prose code {
  background-color: #27272a;
}

/* Highlight.js 스타일 */
.dark .hljs {
  background: #1e1e1e !important;
  color: #d4d4d4 !important;
}
```

---

## 🔧 작동 원리

### 테마 전환 흐름

```
1. 사용자가 버튼 클릭
       ↓
2. setTheme("dark") 또는 setTheme("light") 호출
       ↓
3. next-themes가 <html> 태그에 class 추가/제거
   - 다크모드: <html class="dark">
   - 라이트모드: <html class="">
       ↓
4. CSS 선택자 매칭
   - .dark .prose → 다크모드 스타일 적용
   - .prose → 라이트모드 스타일 적용
       ↓
5. localStorage에 설정 저장
       ↓
6. 새로고침해도 설정 유지
```

---

## 📂 변경된 파일

### 1. tailwind.config.ts (새로 생성)
```typescript
darkMode: "class"  // 핵심 설정
```

### 2. app/globals.css (업데이트)
**변경 사항**:
- ✅ `.dark` 클래스 선택자 추가
- ❌ `@media (prefers-color-scheme: dark)` 제거

**변경된 부분**:
```css
/* CSS 변수 */
.dark { --background: #0a0a0a; }

/* Prose 스타일 */
.dark .prose code { background-color: #27272a; }
.dark .prose a { color: #60a5fa; }
.dark .prose pre { background-color: #1e1e1e !important; }

/* 테이블 */
.dark .prose table { border-color: #3f3f46; }
.dark .prose th { background-color: #27272a; }
.dark .prose tbody tr:nth-child(even) { background-color: #18181b; }

/* Highlight.js */
.dark .hljs { background: #1e1e1e !important; }
.dark .hljs-keyword { color: #569cd6 !important; }
.dark .hljs-string { color: #ce9178 !important; }
```

---

## 🎨 next-themes 작동 원리

### ThemeProvider 설정
```typescript
<ThemeProvider
  attribute="class"      // class 속성 사용
  defaultTheme="system"  // 기본값: 시스템 설정
  enableSystem           // 시스템 테마 감지
>
```

**각 설정의 의미**:

1. **`attribute="class"`**
   - `<html class="dark">` 또는 `<html class="">`
   - Tailwind의 `dark:` 유틸리티와 호환

2. **`defaultTheme="system"`**
   - 처음 방문 시 시스템 다크모드 설정 따름
   - Windows/Mac 설정에 맞춰 자동 적용

3. **`enableSystem`**
   - 시스템 설정 변경 시 자동 감지
   - "시스템 설정 따르기" 옵션 활성화

---

## 🧪 테스트 체크리스트

### 기본 기능
- [ ] 해 아이콘 클릭 → 라이트모드 전환
- [ ] 달 아이콘 클릭 → 다크모드 전환
- [ ] 아이콘이 테마에 맞게 변경됨
- [ ] 배경색이 즉시 변경됨

### 스타일 확인
- [ ] 헤더 배경색 변경 (라이트: 흰색, 다크: 검은색)
- [ ] 본문 배경색 변경 (라이트: #f9fafb, 다크: #18181b)
- [ ] 텍스트 색상 변경
- [ ] 링크 색상 변경 (라이트: 파란색, 다크: 하늘색)
- [ ] 코드 블록 색상 변경
- [ ] 테이블 색상 변경

### 지속성
- [ ] 새로고침 후에도 설정 유지
- [ ] 다른 페이지 이동 후에도 유지
- [ ] 브라우저 종료 후 재방문 시 유지

### 애니메이션
- [ ] 색상 전환이 부드럽게 진행 (0.3초)
- [ ] 깜빡임 없음 (FOUC 방지)

---

## 💡 디버깅 팁

### 1. 테마가 전환되지 않을 때
```javascript
// 개발자 도구 콘솔에서 확인
console.log(document.documentElement.classList);
// 출력: DOMTokenList ["dark"] 또는 []

// localStorage 확인
console.log(localStorage.getItem("theme"));
// 출력: "dark" 또는 "light"
```

### 2. 스타일이 적용되지 않을 때
- `tailwind.config.ts`에 `darkMode: "class"` 있는지 확인
- `.dark` 클래스 선택자 사용했는지 확인
- CSS 파일이 제대로 import 되었는지 확인

### 3. Hydration 에러가 날 때
- `<html suppressHydrationWarning>` 추가
- 버튼이 `{mounted && ...}` 로 감싸져 있는지 확인

---

## 🔄 미디어 쿼리 vs 클래스 기반

### 미디어 쿼리 방식
```css
@media (prefers-color-scheme: dark) {
  /* 다크 모드 스타일 */
}
```
**장점**: 자동으로 시스템 설정 따름
**단점**: 사용자가 직접 전환 불가능

### 클래스 기반 방식
```css
.dark {
  /* 다크 모드 스타일 */
}
```
**장점**: 사용자가 직접 전환 가능, 설정 저장 가능
**단점**: JavaScript 필요

### 우리의 선택: 클래스 기반
- 사용자 제어 가능
- 설정 지속성
- 부드러운 전환
- `next-themes`와 완벽 호환

---

## 🎯 추가 개선 사항

### 1. 시스템 설정 옵션 추가
```typescript
// 3가지 옵션: light, dark, system
<select onChange={(e) => setTheme(e.target.value)}>
  <option value="light">라이트</option>
  <option value="dark">다크</option>
  <option value="system">시스템</option>
</select>
```

### 2. 키보드 단축키
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
      setTheme(theme === "dark" ? "light" : "dark");
    }
  };
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [theme, setTheme]);
```

### 3. 부드러운 전환 애니메이션
```css
* {
  transition: background-color 300ms ease, color 300ms ease;
}
```

---

## 📊 비교표

| 항목 | 미디어 쿼리 | 클래스 기반 (현재) |
|------|------------|-------------------|
| 사용자 제어 | ❌ 불가능 | ✅ 가능 |
| 설정 저장 | ❌ 없음 | ✅ localStorage |
| 시스템 연동 | ✅ 자동 | ✅ 옵션으로 가능 |
| 전환 애니메이션 | ⚠️ 제한적 | ✅ 완전 제어 |
| JavaScript 필요 | ❌ 불필요 | ✅ 필요 |
| SSR 호환 | ✅ 완벽 | ✅ next-themes로 해결 |

---

## 🚀 결론

1. **`tailwind.config.ts`** 생성 → `darkMode: "class"`
2. **`globals.css`** 업데이트 → `.dark` 클래스 사용
3. **`next-themes`** 설정 → ThemeProvider + useTheme
4. **완벽한 테마 전환** → 깜빡임 없이 부드럽게!

이제 사용자가 자유롭게 라이트/다크 모드를 전환할 수 있고, 설정이 저장됩니다! 🌞🌙
