---
title: "Next14 환경에서 Route Modal 구현하기"
description: "NextJS의 Prarallel Routes, Intercepting Routes를 활용한 URL이 변경하는 모달창 구현"
date: "2024-10-02"
author:
  name: "ChangWoo"
coverImage: "/images/posts/tech/next-parallel-routes/cover.png"
tag: ["Next"]
---

## 개요

* 포트폴리오 페이지를 구현하며 다음과 같은 문제를 직면했다.
* 프로젝트 상세 모달창이 열렸을 때, **브라우저 히스토리가 남지 않아 뒤로가기를 누르는 경우 페이지를 벗어나게 된다.**
* 제시된 Exit Button을 통해 동작하면 문제가 없지만, **모바일 사용자의 경우 버튼의 접근보다 뒤로가기를 통해 제어**하는 경우가 많다.
* 반응형을 지원하기에, **쾌적한 사용자 경험을 제공하기 위해서는 해당 부분의 수정이 반드시 필요**하다.

> 라우트 모달을 구현 시 얻을 수 있는 이점 ( 공식문서 참조 )
> 
> 1. URL을 통해 모달 콘텐츠를 공유할 수 있도록 합니다
> 2. 모달을 닫는 대신 페이지를 새로 고칠 때 컨텍스트를 유지합니다
> 3. 이전 경로로 가는 대신 탐색 모달을 닫습니다
> 4. 앞으로 탐색할 때 모달을 다시 엽니다


### Parallel Routes
* **병렬 라우팅(=Parallel Routes)은 하나의 레이아웃에서 여러 페이지를 렌더링할 수 있는 방식**이다.

![](https://velog.velcdn.com/images/changwoo/post/f87d1875-6d17-4693-8740-e62d4ae6dcb8/image.png)
* 폴더명에 '@[folderName]'과 같은 NameSpace를 적용하여 슬롯을 생성할 수 있으며 각 슬롯은 공통된 부모 layout의 props로 전달되어진다

![](https://velog.velcdn.com/images/changwoo/post/0419e840-a9c6-4f63-a366-8ea52ef063aa/image.png)

* 다음과 같이 layout에서 props로서 슬롯을 호출함으로 여러 페이지의 렌더링이 병렬적으로 가능하다
* 이를 통해 **프로젝트를 클릭하면 기존 페이지와 동일한 레이아웃에서 프로젝트 상세 페이지가 렌더링** 되어지도록 한다. 
* 해당 기능으로 컴포넌트를 통해 모달을 관리하는것과 비슷하게 기존 페이지를 배경으로 하는 UI를 가지도록 할 수 있다.

* 하지만, 병렬 라우팅만으로는 URL을 변경할 수 없기 때문에, 페이지의 상태를 반영하거나 기록을 남기기 위해서는 라우트 가로채기를 함께 활용해야한다.

### Intercepting Routs
* **라우트 가로채기(=Intercepting Routs)는 특정경로로 이동할 때, 그 이동을 가로채고 로직이나 조건을 실행할 수 있는 기능**이다
* **기존 브라우저 URL을 마스킹 하면서 새 경로를 현재 레이아웃에 라우팅 하는 경우**에 유용하게 사용한다.
* 해당 기능으로 프로젝트 상세 모달창을 띄우면서 프로젝트 ID로 URL을 변경하더라도 페이지 전환 없이 콘텐츠를 제공할 수 있다.

![](https://velog.velcdn.com/images/changwoo/post/502613ec-1da8-4304-9ee5-80ba93234338/image.png)

- 라우트 가로채기는 다음과 같은 컨벤션이 있으며, 이는 세그먼트를 기준으로 정의한다
	- (.) 동일한 레벨의 세그먼트를 일치
	- (..) 한 단계 위의 세그먼트와 일치
	- (..)(..) 두 단계 위의 세그먼트와 일치
	- (...) 루트 디렉토리의 세그먼트와 일치

![](https://velog.velcdn.com/images/changwoo/post/18e4d3a3-1740-4797-9c3d-ddb101fa9791/image.png)

## 구현
* 제시한 두 기능을 활용하여 라우트 모달을 구현할 수 있다.
* 공식문서에서도 구현방법이 아주 자세히 설명되어있으니, 이를 참고하여 프로젝트에 적용 시켜보자

![](https://velog.velcdn.com/images/changwoo/post/7376000f-5d5f-4104-839d-712ad9dde38f/image.png)

* 다음과 같이 폴더구조를 설계하였다. 
* 전체적인 동작흐름은 다음과 같다

> 1. 프로젝트 카드를 클릭하여 **Link 컴포넌트가 동작하면 projects/id로 URL을 변경하며 라우팅**한다
> 2. 이 때, **라우트 가로채기가 동작하면서 @modal 슬롯 내 가로채기 라우트(.)projects/id 페이지를 렌더**한다. (= 프로젝트 상세 페이지)
> 3. @modal 슬롯은 루트 레이아웃인 layout.tsx에서 병렬적 라우팅이 되어있기에 (.)projects/id는 **기존 페이지와 병렬적으로 출력되어 라우트 모달이 동작**한다. 
>
> 이를 통해 사용자는 기존 페이지를 유지하며 프로젝트 상세 페이지의 확인이 가능하다


```tsx
/* components/projects/ProjectCard */

const ProjectCard = ({ title, badges, description, images, id}: ProjectCardProps) => {
    return (
        <Link
        href={`/projects/${id}`}
        className='{/* 스타일 */}'>
        /* 프로젝트 카드 컨텐츠*/
        </Link>
    );
}

```
* 컴포넌트로 관리하는 모달창은 useState와 같이 상태 변수로 관리를 하였다.
* 라우트 모달창은 페이지를 렌더해야하기 때문에 Next/Link 컴포넌트를 사용한다.
```tsx
/* app/@modal/(.)projects/[id]/page.tsx */
const ProjectDetailModal = ({
  params: {id : projectID}
}: {params : {id : string}}) => {
  /*
	모달 제어 및 데이터 처리 함수
  */
  return (
    <section
      onClick={onClickOverlay}
      id="ProjectDetail"
      className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-70 z-20 overflow-y-auto"
    >
      {isDetailImage && (
        <ProjectImageDetail
          imgs={detailData?.imgs}
          title={detailData?.title}
          onCloseImage={onCloseImage}
          initialIndex={startIndex} 
        />
      )}
      <ProjectHeader
        onCloseModal={onExitModal}
        primaryColor={detailData?.primaryColor}
        URLS={detailData?.URLS}
      />
      <ProjectDetailDescription
        detailData={detailData}
        onClickImage={onClickImage}
      />
    </section>
  );
};

export default ProjectDetailModal;

```

* 해당 컴포넌트를 클릭하면 `/projects/${id}`로 라우팅 되어 해당 폴더 내 page.tsx가 렌더되어져야하지만 라우트 가로채기 구조로 설계하였으므로 가로챈 (.)projects/${id} 내 page.tsx가 렌더링된다.
 
```tsx
/* app/layout.tsx */
export default function RootLayout({
  children,
  modal
}: {
  children: React.ReactNode;
  modal: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-primary">
        {modal}
        {children}  
        </body>
    </html>
  );
}
```
* 공통된 레이아웃에 modal을 병렬적으로 라우팅한다
* @modal 슬롯을 생성하였기에, 슬롯 내 페이지가 렌더되어지면 {modal} props의 자리에 들어가게 된다.

> **유의1. @modal이 호출 되기 이전 layout.tsx에서 props로 받은 modal 페이지를 처리하기위해 default.tsx를 선언하여 기본값을 설정한다.**
* 만약 모달창 페이지가 렌더되어지지 않는다면 {modal} props에 값이 들어가지 않으므로 에러가 발생한다.
* 이를 방지하기 위해 병렬적 라우트페이지에 default.tsx 작성하여 렌더 되기 전 기본값을 갖도록 한다. 

```tsx
/* app/@modal/default.tsx */
export default function Default() {
    return null;
}
```

> **유의2. 만약 Link 컴포넌트 클릭이 아닌 URL 입력 또는 새로고침으로 접근하게 되는 경우 가로채기가 동작하지 않기에 projects/id 페이지를 출력한다**

```tsx
/* app/projects/[id]/page.tsx */
const ProjectDetailPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/');
  }, [router]);

  return (
    <div className='hidden'>프론트엔드 개발자 이창우</div>
  );
};

export default ProjectDetailPage;
```
* 가로채기가 동작하지 않는 경우 url 페이지가 출력되어지기에 해당 렌더를 염두한다.
* 모달창을 전체화면으로 보여주는 것이 일반적이지만, 나는 우선 메인페이지로 반환하는식으로 처리하였다. 

### 결과
![](https://velog.velcdn.com/images/changwoo/post/4ba91aa4-f2bf-4625-8acc-417375e8df16/image.gif)
* 상세 페이지 모달이 등장할때 URL이 변경되고 정상적으로 뒤로가기도 동작한다!

## 마치며
* 처음 설계를 했을 때, 페이지를 구분하지 않고 해당  window.history 객체를 활용하여 히스토리를 남김으로 구현하려 했었다
* 하지만 해당 경우에 반환 URL의 처리가 상당히 난감했는데 마침 딱 필요한 기능을 제공하는 routeModal을 활용하니 훨씬 쉽게 구현할 수 있었다.
* 공식문서에서 아주 자세히 설명하고 예제 코드도 제공하니 이해가 어렵지 않았다! 역시 공식문서 최고

### 참조
- [Next 공식문서 (Pararell routes)](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes)
- [Next 공식문서 (Intercepting routes)](https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes)
- [Next 공식문서 Route Modal 예제 코드 (github)](https://github.com/vercel/nextgram/blob/main/app/photos/%5Bid%5D/page.tsx)