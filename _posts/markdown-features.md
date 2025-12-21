---
title: "마크다운 기능 테스트"
excerpt: "GitHub Flavored Markdown의 다양한 기능들을 테스트합니다. 코드 하이라이팅, 테이블, 체크박스 등을 확인해보세요."
date: "2024-01-30"
author:
  name: "ChangWoo"
coverImage: ""
---

# 마크다운 기능 테스트

이 포스트에서는 향상된 마크다운 렌더링 기능들을 테스트합니다.

## 코드 하이라이팅

### JavaScript

```javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(10);
console.log(`10번째 피보나치 수: ${result}`);
```

### TypeScript

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

const user = await fetchUser(1);
```

### Python

```python
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

numbers = [3, 6, 8, 10, 1, 2, 1]
print(quick_sort(numbers))
```

### Bash

```bash
#!/bin/bash

# 디렉토리 생성 및 파일 작성
mkdir -p project/src
cd project

echo "console.log('Hello, World!');" > src/index.js

# 의존성 설치
npm install express
npm run build
```

## 테이블

| 언어 | 타입 시스템 | 용도 | 인기도 |
|------|------------|------|--------|
| JavaScript | 동적 | 웹 개발 | ⭐⭐⭐⭐⭐ |
| TypeScript | 정적 | 웹 개발 | ⭐⭐⭐⭐⭐ |
| Python | 동적 | 범용, AI/ML | ⭐⭐⭐⭐⭐ |
| Rust | 정적 | 시스템 | ⭐⭐⭐⭐ |
| Go | 정적 | 백엔드 | ⭐⭐⭐⭐ |

### 정렬이 있는 테이블

| 왼쪽 정렬 | 가운데 정렬 | 오른쪽 정렬 |
|:---------|:----------:|----------:|
| Left | Center | Right |
| 1 | 2 | 3 |
| 긴 텍스트 예제 | 중간 | 100% |

## 체크박스 (Task List)

프로젝트 진행 상황:

- [x] 프로젝트 초기화
- [x] 마크다운 파서 설정
- [x] 코드 하이라이팅 추가
- [x] 테이블 스타일링
- [ ] 이미지 최적화
- [ ] 댓글 시스템 구현
- [ ] SEO 최적화

## 텍스트 스타일링

**굵은 글씨**와 *기울임 글씨*를 사용할 수 있습니다.

***굵은 기울임***도 가능합니다.

~~취소선~~으로 삭제된 내용을 표시할 수 있습니다.

## 인용문

> 좋은 코드는 그 자체로 최고의 문서다.
>
> — Steve McConnell

중첩 인용문도 가능합니다:

> 레벨 1 인용문
>
> > 레벨 2 인용문
> >
> > > 레벨 3 인용문

## 링크와 이미지

[GitHub](https://github.com)에서 소스 코드를 확인할 수 있습니다.

자동 링크: https://nextjs.org

## 리스트

### 순서 없는 리스트

- 항목 1
  - 하위 항목 1-1
  - 하위 항목 1-2
    - 하위 항목 1-2-1
- 항목 2
- 항목 3

### 순서 있는 리스트

1. 첫 번째 단계
2. 두 번째 단계
   1. 세부 단계 2-1
   2. 세부 단계 2-2
3. 세 번째 단계

## 인라인 코드

`npm install` 명령어로 패키지를 설치하고, `npm run dev`로 개발 서버를 실행할 수 있습니다.

변수 이름은 `camelCase`로 작성하고, 상수는 `UPPER_SNAKE_CASE`를 사용합니다.

## 수평선

---

## 이모지 지원

🎉 축하합니다! 🚀 프로젝트가 성공적으로 배포되었습니다! ✨

👨‍💻 Happy coding! 💻

---

모든 기능이 정상적으로 작동하는지 확인해보세요!
