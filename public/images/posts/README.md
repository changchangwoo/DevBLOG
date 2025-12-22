# 포스트 이미지 관리 가이드

## 디렉토리 구조

각 포스트는 슬러그에 맞는 폴더에 이미지를 저장합니다:

```
public/images/posts/
├── activities/
│   └── markdown-features/
│       ├── cover.jpg          # 커버 이미지
│       └── example.png        # 본문 이미지
├── life/
│   ├── hello-world/
│   │   └── cover.jpg
│   └── nextjs-blog-architecture/
│       └── cover.jpg
└── project/
    └── typescript-tips/
        └── cover.jpg
```

## 사용 방법

### 1. 커버 이미지 설정

Front Matter에 `coverImage` 필드 추가:

```markdown
---
title: "포스트 제목"
excerpt: "포스트 요약"
date: "2024-01-15"
author:
  name: "작성자"
coverImage: "/images/posts/life/hello-world/cover.jpg"
---
```

### 2. 본문 이미지 사용

Markdown 본문에서 이미지 삽입:

```markdown
![이미지 설명](/images/posts/life/hello-world/diagram.png)
```

## 권장 사항

- **이미지 포맷**: JPG (사진), PNG (스크린샷, 다이어그램)
- **커버 이미지 크기**: 1200x630px (소셜 미디어 공유 최적화)
- **본문 이미지 크기**: 800px 이하 (페이지 로딩 최적화)
- **파일명 규칙**: 소문자, 하이픈 사용 (예: `code-example.png`)

## 예시

`_posts/life/hello-world.md` 포스트의 이미지는:
- `public/images/posts/life/hello-world/cover.jpg`
- `public/images/posts/life/hello-world/example.png`

위치에 저장하고, 포스트에서는:
- `/images/posts/life/hello-world/cover.jpg`
- `/images/posts/life/hello-world/example.png`

경로로 참조합니다.
