---
title: "귀멸의 칼날 호흡 테스트 프로젝트"
description: "무한성 인기에 편승해보고자 만든 본 귀멸의 칼날 호흡 성향 테스트"
date: "2025-09-14"
author:
  name: "ChangWoo"
coverImage: "/images/posts/project/kimetsu-breath-test/cover.png"
tag: ["귀멸의 칼날 호흡 테스트", "토이"]
---

## 개요

> **귀멸의 칼날 호흡 테스트 - 나는 어떤 호흡의 계승자일까?**
>
> - 프론트엔드 : Next, TypeScript,
> - 백엔드 : Node.js
> - 팀 : 1인 개발
> - 깃허브 : https://github.com/changchangwoo/kimetsu-breath-test
> - 배포주소 : https://kimetsu-breath-test.site

- 귀멸의 칼날 애니메이션을 정말 재미있게 봤었는데 **곧 극장판이 상영 예정**이라 너무 기대가 됐었다.
- 트렌드를 활용할수도, 또 흥미롭게 개발할 수 있을 것 같아 해당 주제로 간단한 프로젝트를 계획하고 있었다.
- 그러던중, **serverless로 동작하는 AWS LAMBDA를 알게되었고 이를 학습하면서 진행**하고 싶었다.
- 그렇다면 **가벼운 API 통신과 접근성이 좋은 성향테스트**다!
- 빠르게 개발해서 인기에 편승하자! ( 결국 개봉후 4주뒤에나 배포했다 )

### 구현 목표

> - **SEO를 고려한 페이지 설계**
>   메타 태그 및 OpenGraph 활용
> - 성능 최적화를 통한 사용자 경험 향상
> - **S3+CloudFront, Lambda+DynamoDB** 를 활용한 서비스 배포
> - GIT ACTION을 활용한 CI/CD
> - **개발 생산성 향상의 AI 도구 적극 활용**

## 구현

### 기획 및 설계

![](https://velog.velcdn.com/images/changwoo/post/fe191eb3-e1e5-44c6-bc38-86322c1755fe/image.png)

- Figma를 통해 UI 디자인을 우선적으로 설계하였다.
- 모바일 해상도를 기준으로 하였고, 데스크탑 디자인을 따로 두지 않고, 비율상 깨지지 않는 선에서의 확장을 제공하도록 하였다.
- 단순한 퀴즈 ⇒ 결과 페이지로 구성되었기에 컴포넌트 설계는 어렵지 않았다.
- 다만 **정말 어려웠던건 퀴즈 설계**였다.
- AI와 함께라면 그 어떤것도 두려울게 없다고 생각했었지만 완전한 오산이었다.

<div align="center">

| 주요 성향 1 | 주요 성향 2 | 주요 성향 3 | 결과 호흡 |
| :---------: | :---------: | :---------: | :-------: |
|    침착↑    |    신중↑    |             |    물     |
|    열정↑    |    협력↑    |    결단     |   화염    |
|    방어↑    |    협력↑    |    침착     |   바위    |
|    공격↑    |    결단↑    |             |   바람    |
|     ..      |     ..      |     ..      |    ..     |

</div>

- 총 **12개의 호흡을 결과**로 설계했다.
- 그리고 “공격”, “방어”, “침착”, “협력” ,“신중” ,“헌신” ,“결단” ,“창의” ,“열정” 등 8개의 가중치로서 가지고, 이에따라 결과를 반환한다.
- 퀴즈 문항에 따라 다른 가중치가 반영이 되어야하는데, 다른 가중치와 매핑이 되는 문항 설계가 너무 어려웠다.
- 또 ‘귀살대 대원이 되어 선택을 하는 것’이 테스트의 메인 테마였는데 그렇다보니 퀴즈 및 문항 맥락이 너무 비슷하게 이어졌다
- 사실상 가장 중요했지만, 개발에만 신경을 썼고 컨텐츠의 질을 고려하지 못했기에 **아쉽게도 완성도는 떨어진다고 생각한다**.

### 공유 및 OpenGraph

- 이러한 성향 테스트 서비스는 **간단한 접근성을 통한 공유가 핵심**이라고 생각했다.
- 그렇기에 실제 웹 내부의 UI도 중요하지만, **웹 외부에서 공유되었을 때 보여지는 preview UI 역시 매우 중요**하게 여겼다.

```jsx
/* results/[type]/page.tsx */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;

  const typedType = type as Ttypes;
  const breathData = breathMetadata[typedType];

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const currentUrl = `${baseUrl}/${type}`;

  return {
    title: `${breathData.title}`,
    description: breathData.description,
    openGraph: {
      type: 'website',
      locale: 'ko_KR',
      url: currentUrl,
      title: breathData.title,
      description: breathData.description,
      siteName: '귀멸의 칼날 호흡 성향 테스트',
      images: [
        {
          url: `${baseUrl}/${breathData.ogImage}`,
          width: 1200,
          height: 630,
          alt: breathData.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: breathData.title,
      description: breathData.description,
      images: [`${baseUrl}/${breathData.ogImage}`],
    },

    robots: {
      index: false,
      follow: false,
    },
  };
}
```

- `generateMetadata`를 활용하여 총 13개의 결과 URL에 맞춰 메타데이터를 빌드시점에 생성하였다.

> **🤔 정적 페이지에서 쿼리스트링을 통한 런타임 렌더 이슈**
>
> URL을 처리할 때, 결과 페이지에서 공유한 사용자의 그래프 데이터를 볼 수 있도록 쿼리스트링 `id` 값을 함께 공유하도록 했다.
>
> 이 과정은 **공유된 결과 화면 접속 ⇒ 쿼리스트링을 통한 API 호출 ⇒ 공유 사용자 그래프 식별** 흐름으로 동작한다.
>
> 하지만 이때 사용한 `useSearchParams` 훅은 클라이언트에서만 값을 알 수 있어 정적 생성 시점에서는 처리할 수 없다.
>
> 즉, **정적 생성 단계에서는 쿼리스트링 값이 없기 때문에 런타임 렌더링이 필요하다**는 제약이 생긴다.
>
> 이 문제를 해결하기 위해 Next.js에서 제공하는 `<Suspense>` 컴포넌트로 해당 부분을 감싸주면,
>
> 쿼리스트링 값이 준비되기 전에는 로딩 상태를, 준비된 이후에는 실제 데이터를 보여줄 수 있어 안정적으로 결과 화면을 렌더링할 수 있다.

<table>
  <thead>
    <tr>
      <th align="center">짐승의 호흡 결과 OG</th>
      <th align="center">번개의 호흡 결과 OG</th>
      <th align="center">공유 결과 OG</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">
        <img src="https://velog.velcdn.com/images/changwoo/post/382b3853-3e72-4e0c-baae-52a481142428/image.png" width="100%" /><br />
      </td>
      <td align="center">
        <img src="https://velog.velcdn.com/images/changwoo/post/f01fe603-dc85-46ab-bdf4-afc70527765c/image.png" width="100%" /><br />
      </td>
      <td align="center">
        <img src="https://velog.velcdn.com/images/changwoo/post/e585cc39-d54e-4e3f-a3c2-d3e593737c24/image.png" width="100%" /><br />
      </td>
    </tr>
  </tbody>
</table>

- 그 외에 카카오 공유하기 SDK등을 활용하여 **카카오, 쓰레드, 트위터, 클립 보드 복사 총 4개의 공유하기** 기능이 동작하도록 하였다.

### 페이지 전환 애니메이션

- Next.js 라우팅은 **페이지 단위**에서 동작하기 때문에, `framer-motion`의 `AnimatePresence`처럼 **컴포넌트 언마운트 시점**에만 애니메이션을 적용하는 방식은 그대로 쓸 수 없었다.
- 그래서 **애니메이션이 끝나도록 기다린 후 페이지가 교체되도록 구조를 설계**했다.

```jsx
// contexts/PageTransitionContext.tsx
export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pathname = usePathname();

  // 페이지가 이동되면 항상 초기값으로 false 가진다
  useEffect(() => {
    setIsTransitioning(false);
  }, [pathname]);

  // isTransitioning 전역변수를 true로 하여 페이지 전환이 동작한다
  // 전환과 동시에 700ms 이후 콜백을 실행한다.
  const triggerTransition = (callback?: () => void) => {
    setIsTransitioning(true);

    setTimeout(() => {
      if (callback) callback();
    }, 700);
  };

  return (
    <PageTransitionContext.Provider
      value={{ isTransitioning, triggerTransition }}
    >
      {children}
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const context = useContext(PageTransitionContext);
  if (context === undefined) {
    throw new Error("컨텍스트 없음");
  }
  return context;
}
```

- `isTransitioning` 은 현재 전환 상태를 나타내는 전역 상태이다
- `triggerTransition` 함수가 호출되면 전환이 시작되고, 700ms 이후 콜백을 실행한다.
- 이를 루트 레이아웃에서 `PageTransitionContext` 컴포넌트를 매개로 하여 모든 페이지가 전역 상태를 공유할 수 있다.

```jsx
// animation/PageTransition.tsx

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isTransitioning } = usePageTransition();
  const itemVariants = {
    initial: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.7,
        ease: [0.7, 0.1, 0.4, 1] as const,
      },
    },
  };

  return (
    <>
      <motion.div
        className="w-full h-full overscroll-y-none"
        variants={itemVariants}
        initial="initial"
        animate={isTransitioning ? 'exit' : 'initial'}
      >
        {children}
      </motion.div>
    </>
  );
}

// quiz/QuestionList.tsx
        triggerTransition(() => {
          router.push(href);
        });
      }
```

- 애니메이션을 처리하는 `PageTransition` 컴포넌트에서 전역 상태 `isTransitioning` 을 구독해 exit 애니메이션을 동작한다.
- 이를 통해 **실제 컴포넌트가 삭제되지 않더라도 삭제되는 것 처럼 애니메이션이 동작**한다.
- 콜백으로 router를 넣어 700ms 이후 페이지가 이동되며 실제 컴포넌트 삭제는 이 때 동작한다.

### 퀴즈 페이지

<p align="center">
<img src="https://velog.velcdn.com/images/changwoo/post/1ea62031-63d8-4852-9e11-da09e1e4791d/image.gif" width="50%" style="margin: auto;">
</p>

- 퀴즈는 총 13문항으로, JSON을 파일을 통해 정의된 데이터를, **아이디 값 매핑을 통해 렌더하도록 구성했다**.
- 비즈니스 로직은 단순하였기에, motion 라이브러리를 활용한 애니메이션에만 신경을 썼다.

```jsx
<ul className="flex flex-col gap-3">
  {normalizedOptions.map((option, idx) => (
    <RightToLeft delay={0.3 + 0.05 * idx} key={option.id}>
      <SelectedItem
        isSelected={selectedId === option.id}
        hasAnySelection={selectedId !== null}
        onSelectAnimationComplete={
          selectedId === option.id ? handleSelectAnimationComplete : undefined
        }
      >
        <li
          className={`flex items-center justify-center border rounded-2xl
                w-[90%]
                mx-auto
                cursor-pointer transition-all hover:scale-105 font-nanumB text-center
                 text-white py-2 whitespace-pre-line text-descript
                 bg-lightGray/20 border-border/50
                 ${
                   option.text === ""
                     ? "opacity-0 pointer-events-none h-[38.33px]"
                     : ""
                 }
                `}
          onClick={() => option.text !== "" && handleOptionClick(option.id)}
        >
          {option.text}
        </li>
      </SelectedItem>
    </RightToLeft>
  ))}
</ul>
```

**애니메이션 순서를 함수로서 제어하여 다음과 같은 타임라인을 가지고 동작한다.**

- 컴포넌트 생성시 `RightToLeft`애니메이션 실행
- → 문항 클릭
- → `SelectedItem` 애니메이션 실행
- → `SelectedItem` 제거
- → `RightToLeft` 애니메이션 제거가 동작

```jsx
    const handleSelectOption = (
    optionId: string,
    activeDetermination: boolean
  ) => {
    const newAnswers = [...answers];

    newAnswers[step - 1] = {
      id: optionId,
      weights:
        currentScript.options.find(option => option.id === optionId)?.weights ||
        {},
    };
    if (activeDetermination) {
      newAnswers[step - 1].weights['결단'] = 1;
    }
    setAnswers(newAnswers);
  };

  const handleNextButton = async () => {
    if (step < scripts.length) {
      const newStep = step + 1;
      setStep(newStep);
      pushStepToHistory(newStep);
    } else if (step === scripts.length) {
      const weights: { [key in Tweights]: number } = {
        침착: 0,
        협력: 0,
        신중: 0,
        공격: 0,
        헌신: 0,
        결단: 0,
        창의: 0,
        열정: 0,
      };

      for (const answer of answers) {
        if (answer) {
          for (const [key, value] of Object.entries(answer.weights)) {
            weights[key as Tweights] += value || 0;
          }
        }
      }

      try {
        const result = await fetchData(`/results`, 'POST', { weights });
        const type = result.type as string;
        const id = result.id as string;
        const href = `/results/${type}?id=${id}`;
        localStorage.setItem('id', JSON.stringify(id));
        localStorage.setItem('type', JSON.stringify(type));
        triggerTransition(() => {
          router.push(href);
        });
      } catch (err) {
        console.error('API 요청 실패:', err);
      }
    }
  };
```

- `handleSelectOption` 는 사용자의 선택 정보에 대한 가중치를 상태에 저장한다.
- `handleNextButton` 문항의 단계상태를 관리하며, 마지막 단계일 경우 fetchAPI를 통해 결과를 서버로 전송한다.
- **서버에서 결과에 따른 값과 고유 ID값을 반환하면 이를 바탕으로 URL을 구성**하여 결과페이지로 이동하여 구성한다.

### 결과 페이지

<p align="center">
<img src="https://velog.velcdn.com/images/changwoo/post/0049082f-26c6-4a53-9a19-96235a1c617d/image.gif" width="50%" style="margin: auto;">
</p>

```jsx
// results/[type]/page.tsx

export async function generateStaticParams() {
  return Object.keys(breathingColors).map(type => ({
    type: type as Ttypes,
  }));
}
```

- `generateStaticParams` 및`getnerateMetadata` 를 통해 **결과 페이지에 대한 정적 경로 및 메타데이터를 빌드 시점에서 정의**하였다.
- 쿼리스트링에 정의된id 값은 `ResultHeader` 컴포넌트에서 서버로부터 해당 아이디에대한 가중치를 불러온다.
- 그리고 이 가중치는 Recharts 라이브러리로 구현한 방사형 차트에 값이 되어 출력한다.
  s

```jsx
useEffect(() => {
  if (!graphRef.current) return;

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        setShowGraph(true);
        observer.disconnect();
      }
    },
    { threshold: 0.3 }
  );

  observer.observe(graphRef.current);

  return () => observer.disconnect();
}, []);
```

- `IntersectionObserber`를 활용하여 사용자의 시야가 차트에 진입하는 순간, 차트 그래프를 보여주도록 하였다.

### 폰트 및 이미지 최적화

- 해당 프로젝트는 이미지가 굉장히 많이 들어간다.
- 평균 이용 시간은 5분이 안될 것 같지만, 사용자는 대략 20개 이상의 이미지를 로드하게 된다ㄷㄷ.
- **사용자 경험을 향상시키기 위해서 최적화는 필수**였다.

> **🙂 최적화는 다음과 같은 방법을 진행하였다.**
>
> 1. 이미지 webp 확장자 변경
>
> 2. 폰트 확장자 woff, woff-2 변경
>
> 3. 프리로딩을 통한 이미지 캐싱

- 가장 쉽고, 가장 효율적인 방법으로 **모든 이미지의 확장자를 webp로 변환**하였다.
- 기존 png보다 webP로 변형하여 활용하는것이 **70% 이상 용량 압축 효과**를 보여주었다.

webp 변환은 webP 변환 사이트를 활용하였다.

- [https://www.freeconvert.com/ko/webp-converter](https://www.freeconvert.com/ko/webp-converter)
- [https://www.iloveimg.com/ko/convert-to-jpg/webp-to-jpg](https://www.iloveimg.com/ko/convert-to-jpg/webp-to-jpg)

```jsx
@font-face {
  font-family: 'shilla';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2206-02@1.0/Shilla_CultureB-Bold.woff2')
    format('woff2');
  font-weight: 700;
  font-display: swap;
}
```

- 폰트의 확장자도 변경하였다.
- 기존 ttf 파일을 설치하여, 불러오는 방식이었지만 **웹에서 woff2-woff 확장자를 받아 불러오도록 수정**하였다.

```jsx
// ClientLoadingWrapper.tsx
export default function ClientLoadingWrapper({
  children,
}: ClientLoadingWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  useEffect(() => {
    const checkFonts = async () => {
      try {
        await document.fonts.ready;
        setFontsLoaded(true);
      } catch (error) {
        console.log('Font loading check failed:', error);
        setFontsLoaded(true);
```

- 기존 **ttf 보다 50%가량 빠른 속도**로 폰트를 불러올 수 있었다.

```jsx
// ClientLoadingWrapper.tsx

export default function ClientLoadingWrapper({
  children,
}: ClientLoadingWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const checkFonts = async () => {
      try {
        await document.fonts.ready;
        setFontsLoaded(true);
      } catch (error) {
        console.log('Font loading check failed:', error);
        setFontsLoaded(true);
      }
    };

    const checkImages = () => {
      const criticalImages = [
        '/imgs/bg.webp',
        '/imgs/og/OG_01.webp',
        '/imgs/og/OG_02.webp',
      ];

      const imagePromises = criticalImages.map(src => {
        return new Promise<void>(resolve => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => {
            console.log(`Failed to load image: ${src}`);
            resolve();
          };
          img.src = src;
        });
      });

      Promise.all(imagePromises).then(() => {
        setImagesLoaded(true);
      });
    };

    if (typeof window !== 'undefined') {
      checkFonts();
      checkImages();
    }
  }, []);

  useEffect(() => {
    if (fontsLoaded && imagesLoaded) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [fontsLoaded, imagesLoaded]);

  return (
    <>
      {isLoading && <LoadingScreen />}

      <div
        className={`transition-all duration-700 ease-out ${
          isLoading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`}
      >
        {children}
      </div>
    </>
  );
}
```

- 폰트가 디자인에서 매우 큰 요소였기에, 폰트 로드 전 컴포넌트가 출력되면 마치 오류로 느껴지듯 사용자 경험을 크게 해쳤다.
- 그렇기에 **LoadingWraaper를 만들어, 루트 레이아웃을 감싸 PreLoading을 적용**하였다.
- 이를 통해 주요 리소스 로딩까지 로딩 컴포넌트가 출력되어져 **사용자가 일관된 경험**을 할 수 있도록 하였다.

```jsx
// QuestionList.tsx

useEffect(() => {
  if (currentScript.id < scripts.length) {
    const img = new Image();
    img.src = `/imgs/q${currentScript.id + 1}.webp`;
  }
}, [currentScript.id]);
```

- 또, 테스트 진행중에는 **다음 이미지를 미리 메모리에 로드하여, 이미지 로딩 지연 없이 사용자 경험을 부드럽게 유지**하도록 하였다.
- 브라우저 이미지 캐싱을 활용하여, **로딩 속도 보장과 UX 저하를 방지**할 수 있었다.

> Next Image 컴포넌트에 레이지로딩 속성이 있더라도, **Image의 src를 선언한순간 메모리에 올라 간 후 캐시에 저장**하기 때문에, 사용자가 이미지 요청 시, 바로 제공할 수 있다.

## 마치며

- 정적 컴포넌트를 최대한 분리하려고 **모든 useClient 컴포넌트를 래퍼로 감쌌지만, SEO를 위해 선택한 방식이 오히려 구조를 복잡**하게 만든 것 같았다.
- 역시 개인프로젝트가 재밌지만, **한계가 조금 느껴져 팀 프로젝트를 진행하며 다양한 피드백을 받으며 성장**하고싶다.
- 별개로 AWS Lambda와 DynamoDB를 학습해보려고했는데, 이번에는 간단히 사용만 해 보았다.
- 그래도 **서버리스와 NoSQL을 직접 경험해본 것은 큰 의미**가 있었다.
- 백단 인프라 구성이 간편해지니 앞으로 **토이프로젝트 바운더리가 훨씬 넓어질 것 같다!**

- 개봉 1주일 전 시작해서, 2주안에 완성하려고했었는데 최근들어 내적,외적으로 고민거리가 많이 생겨 소홀히했다. ㅠㅠ..미안
