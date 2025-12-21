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
