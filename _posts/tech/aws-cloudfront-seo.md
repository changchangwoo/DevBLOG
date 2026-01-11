---
title: "AWS S3+CloudFront를 통한 정적 웹 배포 및 SEO 개선"
description: "포켓몬 상성 계산기 도메인을 이전하면서 배운 정적 웹 배포 인프라 구성"
date: "2025-09-11"
author:
  name: "ChangWoo"
coverImage: "/images/posts/tech/aws-cloudfront-seo/cover.png"
tag: ["AWS S3", "AWS CloudFront", "SEO"]
---

### 개요

- **[방문객수 10배 증가! 포켓몬 약점 계산기 리팩토링](http://localhost:3000/post/projects/poke-match-type-refactor)** 이후, 토이 프로젝트 개발에 열의가 다시 불타올랐다.
- 앞으로도 더 많은 프로젝트들을 생성하고 배포할 예정이기에, 기존 무료 플랜이었던 Vercel에서 **AWS로 이전을 선택**하게 되었다.
- 이 과정에서 도메인 구매부터 사이트 배포까지 여러 가지 시행착오와 이슈들을 겪게 되었다.
- 기록하지 않으면 잊어버릴 것 같다..

> 🤔 **왜 AWS로 옮겼을까?**
> 
> - AWS는 프론트,백,인프라까지 자체 서비스로 모두 지원하기에 **확장성과 유연성이 뛰어나다.**
> - 또한 서버 및 네트워크의 세부적인 설정이 가능하여 **인프라의 원리**를 깊게 학습할 수 있다.
> - 앞 선 이유로, 많은 기업들이 AWS를 통해 서버를 운용하기에 **실무에 가까운 환경**을 구성할 수 있다.

## S3 + CloudFront를 활용한 정적 웹 사이트 배포

### S3 ( Simple Storage Service )

- S3는 AWS에서 제공하는** 정적 파일 저장소**이다.
- 말 그대로 HTML, CSS, JS, 이미지, 동영상 등 정적 파일을 저장하고 제공할 수 있는 서비스이다.
- **‘버킷’을 단위**로, 데이터를 여러 지역에 복제해 안정적으로 보관하며, 파일 저장 뿐 아닌 배포도 가능하다

### CloudFront

- CloudFront는 AWS에서 제공하는 **CDN(Content Delivery Network) 서비스**이다.
- 전 세계 엣지 로케이션(캐시 서버)를 통해 사용자와 가까운 서버에서 콘텐츠를 전달한다.
- 물리적으로 거리가 멀면 요청 속도에도 차이가 날 수 있는데, 이를 통해 전송 속도를 향상 시킨다.
- **HTTPS 지원, DDOS 방어, 캐싱 정책 등 보안과 성능 관리 기능**도 제공한다

> 🤓 **S3 + CloudFront를 함께 사용하는 이유**
> 
> - S3는 특정 리전에만 존재하지만, CloudFront는 전 세계 엣지 서버를 통해 콘텐츠를 배포하므로 **사용자에게 빠른 전달**이 가능하다.
> - CloudFront의 캐싱 기능을 통해 S3로의 요청 수를 줄여 **비용 절감**이 가능하다.
> - S3 버킷을 CloudFront를 통해서만 접근 할 수 있고, **HTTPS 지원 등 보안성이 향상**된다.

### S3 버킷 생성

![](https://velog.velcdn.com/images/changwoo/post/f0484a9f-cb81-424e-8b1e-3fec7e1a11f8/image.png)
- 버킷에 사용할 이름을 작성한다.

![](https://velog.velcdn.com/images/changwoo/post/e4311bd3-334b-47cd-b386-edf06aafc489/image.png)
- 버킷을 AWS를 통해서 관리를 할 것이므로 **ACL을 비활성화** 한다.

![](https://velog.velcdn.com/images/changwoo/post/8da59061-7b05-477e-ae98-56710a4039ea/image.png)

- CloudFront를 통해 버킷에 접근하기에 **퍼블릭 액세스는 차단**한다.

![](https://velog.velcdn.com/images/changwoo/post/b4bd6cb2-1734-4b6d-9995-8391bd623628/image.png)

![](https://velog.velcdn.com/images/changwoo/post/1db399a1-cf9e-4821-9996-ff032292e39f/image.png)


### CloudFront 배포 생성

![](https://velog.velcdn.com/images/changwoo/post/b8c013a5-4ba6-436f-809b-8373e3b4d659/image.png)
- 배포에 사용할 이름을 정의한다.
- 나는 도메인명으로 작성했지만 이와는 상관없으며 단순 CloudFront 배포의 구분이다.
- 도메인의 경우, 추후 연결하기에 비워두었다.

![](https://velog.velcdn.com/images/changwoo/post/8517caac-e0dd-4662-a05b-eade024493f8/image.png)

- 방금전 생성한 **s3 버킷의 원본 주소를 찾아 연결**한다.

![](https://velog.velcdn.com/images/changwoo/post/ecc125d9-75a4-483b-90fd-67b47bdffca6/image.png)

![](https://velog.velcdn.com/images/changwoo/post/ef51574d-a711-4d1a-9096-1ba9d63ce96c/image.png)

- AWS WAF는 AWS에서 제공하는 **유료 방화벽 서비스**이다.
- WAF의 설정은 **추가 요금을 생각보다 요구**하기에 고민이 필요하다.
- 지금과 같은 토이 프로젝트에서는 크게 고려하지 않을 것 같다.
- 나는 프리티어 크레딧이 꽤 많이 남아 있어 활성화 하기는 했는데..
- 현재 청구되는 요금의 대부분이 WAF 비용이다.

![](https://velog.velcdn.com/images/changwoo/post/0ad198c9-187b-448c-b8b8-43a710535fe3/image.png)


- 이후 (—-.cloudfront.net)형식의 도메인이 생성되었지만 아직은 해당 도메인 접근시 Access Denied가 출력된다.
- 현재는 S3버킷이 CloudFront 액세스를 허용하고 있지 않기때문이다.

![](https://velog.velcdn.com/images/changwoo/post/99085653-b8b9-467b-943b-fe0688771c5e/image.png)

- 배포상세 페이지에서 원본탭으로 이동 후, 원본 도메인 편집에 접근한다.

![](https://velog.velcdn.com/images/changwoo/post/45d76cc0-1b4e-4950-af86-8842943a10a5/image.png)

- OAC를 생성한다. 
- **OAC는 CloudFront가 S3 버킷에 접근할 때 인증 역할을 수행**한다.

![](https://velog.velcdn.com/images/changwoo/post/080eec2c-44b5-4403-aab1-3da1a6cca89a/image.png)

- 정책 복사 버튼을 통해 정책을 복사한다.
- 이후 다시 원본 S3버킷으로 이동한다 ( 하단 S3 버킷 권한으로 이동 하이퍼링크 )
- S3 버킷 ⇒ 권한 탭 ⇒ 버킷 정책을 편집하여, 복사한 CloudFront 정책을 붙여넣는다.

![](https://velog.velcdn.com/images/changwoo/post/12603234-5520-4759-a599-4074abaa6b7b/image.png)

- 이후 cloudFront 도메인을 통한 배포가 완료되었으며 접근이 가능하다!

> **정책까지 변경했지만, 도메인으로 접근시 403오류가 나타나는 경우**
>
> 배포 도메인의 루트 객체로 접근했는지 확인이 필요하다. (—.cloudfront.net**/index.html**)

![](https://velog.velcdn.com/images/changwoo/post/a16a6651-8d68-4202-a68e-40f617911c70/image.png)

- 배포 상세페이지 **일반 탭 설정에서 루트 오브젝트의 편집**이 가능하다.

![](https://velog.velcdn.com/images/changwoo/post/607fc551-bcb7-49de-98ae-d0ab5070dde2/image.png)


## Route 53 통한 외부 도메인 연결

### Route53 호스팅 영역 생성

- AWS Route 53에서, 도메인 이름을 입력 후, **호스팅 영역을 생성**한다.

![](https://velog.velcdn.com/images/changwoo/post/f51d4139-4465-47e8-be00-1d312f93c3fd/image.png)
- 생성한 호스팅 영역 상세페이지 ⇒ 레코드 탭을 확인한다.
- 현재 도메인을 CloudFront로 라우팅 하기 위해 **레코드를 생성**한다.

![](https://velog.velcdn.com/images/changwoo/post/fa46cfa6-db20-4bf7-a8d4-c931c6e8a3e9/image.png)
- **루트 도메인 처리를 위해 레코드 이름을 비워두고, 레코드 유형은 A, 별칭에 대한 라우팅으로 배포한 CloudFront 별칭 값을 연결**한다.
- 이후 레코드를 생성하면 해당 도메인으로 접속 시, CloudFront 주소로 라우팅하여 접속한다.

### 도메인 구매

- cloudfront의 도메인은 배포ID를 통해 자동으로 부여되어지는데 난수 같은 문자열을 띄고있다.
- 이는 조금 지저분하기에.. *서비스로서 배포하기위해서는 도메인 변경이 필요**하다.
- route53에서 구매해도 되는데 가비아에서 할인하는 도메인이 더 저렴해서 가비아에서 구매했다.

![](https://velog.velcdn.com/images/changwoo/post/7283caf8-ea24-4dfa-b13c-715f23aba527/image.png)

- 나는 2500원을 주고 [poke-match-type.site](http://poke-match-type.site) 도메인을 구매했다!

> 당장은 할인 가격인 가비아의 도메인이 더 저렴하지만, 년 단위로 금액이 책정되기에 내년에는 해당 도메인 가격이 할인 가격이 아닐 수 있다. 
> 
> 그렇기에 서비스를 장기적으로 운영한다면, 도메인 구매 전 변경 비용과 유지했을 때의 비용을 전부 고려해야한다.

### 가비아 네임 서버 Route53 이전

- 현재 구매한 도메인 네임서버는 가비아 네임서버로 설정되어있다.
- **AWS 환경에서 인프라를 통합적으로 관리 하기 위해서는 Route53으로 도메인 네임 서버의 이전이 필**요하다.
- 레코드를 확인해보면 NS 유형의 값이 4개 있다.
- 해당 값이 Route53의 호스팅영역 네임서버이다. 이 값들을 전부 복사한다.

![](https://velog.velcdn.com/images/changwoo/post/cfce42a5-e6fc-4e47-8885-acd703c40712/image.png)

- 이후 가비아로 돌아와 마이페이지 ⇒구매한 도메인 상세페이지 ⇒ 네임서버 설정에 들어간다.
- Route 53에서 복사한 4개의 NS 레코드 값을 등록한다.
    - 이때, 복사한 네임서버의 값은 끝에 .(dot)이 있을텐데 지워 준 후 등록한다.
    - 저장 후, 적용을 기다린다

![](https://velog.velcdn.com/images/changwoo/post/42b93797-65c6-4ea5-8180-77bced48db45/image.png)

> **도메인 소유권은 가비아가 유지하되, DNS 관리만 Route53으로 이전하였다**
>
> 이를 통해 해당 도메인에 대해 CloudFront 배포 연결 및 ACM SSL 인증서 적용이 가능하다.

### CloudFront 도메인 연결

- 다시 CloduFront 배포 페이지의 일반 탭으로 넘어와 Add domain버튼으로 대체 도메인을 연결한다.

![](https://velog.velcdn.com/images/changwoo/post/91c09d79-fbc9-4f86-982b-40fc0e1fa691/image.png)

- 도메인 이름을 입력한다

![](https://velog.velcdn.com/images/changwoo/post/300a4e47-f3ad-4d3a-bc42-684023aac3c0/image.png)

- 기존 **CloudFront는 AWS가 SSL을 적용해 이미 HTTPS가 가능**하다.
- 하지만 **구매한 도메인을 CloudFront와 연결하기 위해서는 해당 도메인에 대한 SSL 인증서가 필요**하다.
- 이는 AWS ACM에서 발급이 가능하다.
- 만약 Route53 호스팅 영역에 입력한 도메인이 정상적으로 등록되어있다면, 
Create a new certficate ⇒ **Create cerficate 버튼을 통해 현재 페이지에서 바로 인증서를 생성**할 수 있다.

![](https://velog.velcdn.com/images/changwoo/post/f552f701-e3fa-4053-9209-d49340a63dd5/image.png)

- 성공적으로 도메인이 연결되었다!

## Vercel 배포 사이트 이전

- 사이트 이전에서 가장 고려했던건 **SEO Value 확보**였다.
- 많지는 않더라도, 일 평균 80명 가까이 방문해주던 이용자들이 너무 소중했다.
- [구글 검색 센터 공식문서, 사이트 이전 및 변경](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes?hl=ko)을 최대한 고려하며 이전 작업에 진행하였다

### 리다이렉트 설정

```jsx
/* vercel.json */

{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }],
  "redirects": [
    {
      "source": "/(.*)",
      "destination": "https://poke-match-type.site/$1",
      "permanent": true
    }
  ]
}

```

- 가장먼저, **페이지 리다이렉트를 설정**하였다.
- 기존 배포 중인 **Vercel 서버로 접속 시, 새로 이전한 도메인 서버로 이동**되도록 하였다.
- 또한 루트의 <Head>에 **canonical 태그**를 새 도메인으로 지정하여, 검색 결과에서 새 도메인이 우선 노출되도록 하였다.

### 새 도메인 등록 및 페이지 이전

- 그 다음으로 **Google Search Cosnole에 새 도메인을 등록하고, 인증**하였다.
- 설정 ⇒ 주소 변경 기능을 사용하여  이전할 새 사이트를 입력함으로 **구글에게 사이트 이전을 알렸다.**

![](https://velog.velcdn.com/images/changwoo/post/68c06cc0-ead4-4f2e-a41b-272e905db746/image.png)

> 사이트 이전하기 전, 해당 도메인에 대한 모든 요청이 정상적으로 수행되는지 **꼼꼼히 확인 후 신중하게 수행해야한다.**
> 

## SEO 향상

- 사이트를 성공적으로 이전한 후 야금야금 이전 트래픽을 복구하나 싶더니..!

![](https://velog.velcdn.com/images/changwoo/post/1c839876-33ac-4b67-bad8-043369b48570/image.png)

- 코끼리를 삼킨 보아뱀이 되어버렸다…
- SEO점수가 급감한 이유는 정확히 알 수 없었다.
- 따라서 페이지 색인 생성이 안되는 이유부터 하나씩 접근해보기로 했다.

### www, non-www URL 분리

- 기존 배포서버는 non-www 형식으로 [https://poke-match-type.site](https://poke-match-type.site)의 도메인을 가지고 있다.
- 이를 www에도 접근할 수 있도록 **Route53에서 www 서브 도메인 접근 시 non-www 페이지로 리다이렉트 하도록 레코드 설정**하였다.
- 하지만 이런 레코드 설정은 **DNS 레벨에서 페이지를 반환할 뿐, 301 리다이렉트를 반환하지 않는다.**
- 이는 SEO가 다음과 같이 `poke-match-type.site` , `www.poke-match-type.site` 두 개의 URL에서 접근 가능하면 중복 페이지로 인식할 수 있다는 문제가 있다.
- AWS 공식문서 [웹 페이지 리디렉션 구성](https://docs.aws.amazon.com/ko_kr/AmazonS3/latest/userguide/how-to-page-redirect.html) 을 바탕으로 www에 대한 배포 환경을 새로 만들도록 수정하였다.

 


![](https://velog.velcdn.com/images/changwoo/post/0cd134ed-3a4e-4d1e-91c1-c7bd9ccfd8fa/image.png)

![](https://velog.velcdn.com/images/changwoo/post/64c7364f-d0b8-4714-9a8e-f9f98c14d150/image.png)
- **AWS s3 버킷을 앞서 원본 배포와 동일한 방법으로 생성**한다.
- 버킷 상세페이지에 속성 탭 ⇒ **정적 웹 사이트 호스팅 편집 ⇒ 다음과 같이 호스팅할 도메인을 입력**한다.
- S3 접근에 대해 반드시 **정적 웹 사이트 호스팅을 활성화**해야한다

![](https://velog.velcdn.com/images/changwoo/post/203c1c84-8597-4f86-ae37-4bcf45d55166/image.png)

- 이제, 해당 버킷 엔드포인트로 접근하면 호스팅한 사이트로 연결 되어진다.
- 이 버킷 역시 CloudFront를 통해서 배포하면 된다.

> **🤔 리다이렉션 버킷은 단순 리다이렉션 용도인데 왜 cloudFront를 감싸야 할까?**
> 
> 
> 리다이렉션 버킷은 단순 리다이렉션만 수행하면 되므로 캐싱 기능은 크게 필요하지 않다.
> 그러나 S3 정적 웹사이트 엔드포인트는 HTTPS를 지원하지 않으며,
> 커스텀 도메인 연결 시 필요한 ACM 인증서 또한 CloudFront를 통해서만 적용할 수 있다.
> 따라서 **보안성과 HTTPS 리다이렉트를 위해 리다이렉션 버킷 역시 CloudFront로 배포**해야 한다.
> 
  
- 앞선 원본 배포와 **동일한 방법으로 CloudFront 배포를 생성**한다.

![](https://velog.velcdn.com/images/changwoo/post/2276e296-f566-47b2-9321-2239939514b2/image.png)

- 대체 도메인은 www 사이트 주소를 입력한다.

![](https://velog.velcdn.com/images/changwoo/post/844ea3dc-fc50-4e09-b7af-5b47c4829cdc/image.png)

- 리다이렉트 버킷을 오리진으로 하면 정적 웹 사이트 설정때문에 다음같은 경고문이 출력되는데, **웹 사이트 엔드포인트 사용 버튼을 클릭**한다
- 이 외에는 원본과 동일한 방법으로 ACM 연결 한 후, 배포를 생성한다.

![](https://velog.velcdn.com/images/changwoo/post/97d7149f-261e-4495-a6e4-161789597af6/image.png)

- 성공적으로 배포가 생성되었으면, **배포 도메인 접근시 원본 도메인(non-www)으로 리다이렉트**한다.
- 이제 www 서브 도메인과 cloudFront를 연결하기 위해, route53 호스팅 영역으로 다시 돌아간다.

![](https://velog.velcdn.com/images/changwoo/post/1d6a16f4-18c4-439e-adcf-f513be10a1b8/image.png)

- 해당 도메인 호스팅영역에서 레코드를 생성 한다.
- **레코드 이름은 www, 유형은 A, 라우팅 대상은 별칭 ⇒ CloudFront 배포에 대한 별칭 ⇒ 배포한 www CloudFront 배포 주소를 연결**하면 된다.
- 이후 **www 접근에도 원본 도메인으로 리다이렉트**가 바로 되어진다

![](https://velog.velcdn.com/images/changwoo/post/5da0758f-2f12-46d2-8089-8147353482b1/image.png)

- curl을 통해 확인하면, www로 접근시 301 상태코드를 반환하는것을 확인할 수 있다.

> **정리하자면 ...**
> 1. non-www 접근 ⇒ 원본 CloudFront ⇒ 원본 버킷 ⇒ 원본 서비스 페이지
> 2. www 접근 ⇒ 리다이렉트  CloudFront ⇒ 리다이렉트 버킷 ⇒ (301 상태 코드를 가진 채) 1번 동작

### Sitemap.xml 추가

> **Sitemap.xml이란**
> 웹사이트의 URL 구조와 메타 정보를 검색 엔진에 알려주는 XML 형식 파일이다.
>
> 검색엔진이 사이트를 효율적으로 크롤링 할 수 있도록 지원한다.

- 이전에는 메인 페이지 하나로서, 구조란게 따로 없어 사이트맵을 굳이 추가하지 않았었다.
- 하지만 sitemap.xml 여부가 SEO 점수의 영향을 줄 수 있다는 내용을 보고 추가했다.

```jsx
<?xml version="1.0" encoding="UTF-8"?>
<urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
<!-- created with Free Online Sitemap Generator www.xml-sitemaps.com -->

<url>
  <loc>https://poke-match-type.site/</loc>
  <lastmod>2025-08-15T01:23:36+00:00</lastmod>
</url>

</urlset>
```

- 주석처리된 사이트맵 생성 사이트에서 만들었는데 음.. 크게 도움 됐는지는 모르겠다.

### 타겟 키워드 재정의

![](https://velog.velcdn.com/images/changwoo/post/70246a88-6b48-4f88-b7a8-9f8574469021/image.png)

- 하락세가 시작될 당시, 인기 검색어는 다음과 같았다.
- ‘포켓몬 약점 계산기’ 타이틀을 가지고 있어, 역시 해당 검색어가 노출과 클릭수가 가장 높았고 구글 평균 게재순위 도 최상위였다.
- 하지만 평균 게재순위가 5위 이하였음에도 ‘포켓몬 상성 계산기’ 검색의 노출수가 약점 계산기를 웃돌았다.
- 내 서비스 기능을 원하는 사람들은 약점보다 상성 키워드에 검색을 더 초점에 맞춘다고 생각이 들었고, 이에 **메타 태그의 핵심 키워드들을 전부 약점 ⇒ 상성 으로 변경**하였다.

```jsx
    <meta
      name="description"
      content="포켓몬 상성 계산기 - 초보자를 위한 초간단 포켓몬 상성 계산 서비스. 쉽게 타입 상성을 확인하세요! Pokémon Weakness Calculator - Simple tool to check type effectiveness and weaknesses."
    />
    <meta
      name="keywords"
      content="포켓몬, 상성 계산기, 포켓몬 타입, 포켓몬 상성, 상성 계산기, 타입 계산기, 타입 퀴즈, Pokémon, weakness calculator, type chart, type matchup, Pokémon type quiz, type effectiveness"
    />
    <meta name="author" content="changchangwoo" />
    <meta name="robots" content="index, follow" />
    <meta property="og:title" content="포켓몬 상성 계산기" />
    <meta
      property="og:description"
      content="초보자를 위한 초간단 포켓몬 상성 계산 서비스 - 쉽게 타입 상성을 확인하세요!"
    />
```

![](https://velog.velcdn.com/images/changwoo/post/44262840-432a-48a3-9a1c-a346cd7e82da/image.png)

- SEO가 회복과 키워드 변경이 크게 효과가 있었는지, **평균 방문자수가 300명 가까이 치솟았다!**

## 마치며

- 이전에 AWS에 대해 학습한 경험이 있었는데 너무 지루하고 따분했다.
    - 하나를 하기위해서는 연결된 또 다른 서비스로 이동해 무언가를 해야한다는게 어려웠다
- 하지만 이번에 도메인을 이전 하며 접근한 AWS는 생각보다 훨씬 흥미로웠고, 왜 서비스간 연결이 필요하고 어떻게 동작하게 되는지 조금 이해할 수 있었다.
- 또, 클릭수가 수치적으로 크게 증가했는데 이는 **SEO 최적화에 대한 관심으로 이어져 현재 Next.js를 다시 공부하는 계기**가 되었다.
- 다음에는 **GA를 조금 적극적으로 활용해, 사용자 체류 시간과 경험 향상을 위해 고민**하는것도 재밌을 것 같다.

### 참고자료
- [구글 공식 문서 - 사이트 이동 및 이전](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes?hl=ko)
- [S3 + Cloudfront를 이용해 www redirect를 구현한 Static Website 호스팅하기](https://nangman14.tistory.com/101)
- [AWS 공식 자습서 - 정적 웹 사이트 자습서](https://docs.aws.amazon.com/ko_kr/AmazonS3/latest/userguide/static-website-tutorials.html)