---
title: "토이프로젝트를 통해 부딪혀본 FSD 아키텍처"
description: "간단한 날씨 서비스를 만들며 Feature-Sliced-Design을 적용하고 고민했던 설계 과정의 기록"
date: "2026-02-02"
author:
  name: "ChangWoo"
coverImage: "/images/posts/tech/fsd-with-wheather-app/cover.png"
tag: ["FSD", "아키텍처"]
---

## 개요

- 프로젝트를 진행하다보면 규모가 커질수록 역할과 책임이 겹치는 코드가 늘어나 관리에 어려움을 겪곤 했다.
- 단순히 코드를 분리하는 것만으로는 본질적인 문제가 해결되지 않았으며, 기능이 추가될수록 수정과 확장이 점점 부담스러워졌다.
- 이러한 경험을 통해 코드의 역할이나 책임을 구조적으로 나눌 수 있는 아키텍처의 필요성을 느꼈고 FSD를 접하게 되었다.
- 이론에 그치지 않고 실제로 체감해보자 간단한 서비스를 구현하며 FSD 아키텍처를 적용해보았다.

## FSD 아키텍처란?

- Feature-Sliced Design(FSD)은 **비즈니스 변화에 유연하게 대응하도록 설계된
  프론트엔드 아키텍처** 접근 방식이다.
- 컴포넌트 단위가 아닌 역할과 책임을 기준으로 구조를 나누는 것을 목표로 하며, 규모가 커질수록 복잡해지는 코드베이스를 보다 쉽게 관리할 수 있도록 도와준다.
- FSD는 크게 레이어(Layer), 슬라이스(Slice), 세그먼트(Segment) 라는 세 가지 수직 구조를 기준으로 애플리케이션을 구성한다.

![레이어 구조 이미지](/images/posts/tech/fsd-with-wheather-app/layer-architect.jpg)

### 레이어

- **레이어는 애플리케이션을 가장 큰 단위로 분해하는 기준**이자 FSD에서 정의하는 최상위 디렉토리 구조이다.
- 일반적으로 `app`, `pages`, `widgets`, `features`, `entities`, `shared` 6가지로 분류하며 각 레이어는 명확한 책임과 의존성 방향을 가진다.

| **레이어** | **설명**                                                                                                 |
| ---------- | -------------------------------------------------------------------------------------------------------- |
| app        | 애플리케이션 로직이 초기화 되는 곳, Provider, Router, 전역 타입 및 스타일 선언, 애플리케이션 진입점 역할 |
| pages      | 애플리케이션 페이지 포함                                                                                 |
| widgets    | 페이지에 사용되는 독립적 UI 컴포넌트                                                                     |
| features   | 비즈니스 가치를 전달하는 사용자 시나리오와 기능, 좋아요, 리뷰, 평가 등                                   |
| entities   | 비즈니스 엔티티를 나타냄. 사용자, 리뷰, 댓글 등 포함                                                     |
| shared     | 특정 비즈니스 로직에 종속되지 않은 재사용 가능한 컴포넌트, 유틸리티 포함                                 |

- 모든 프로젝트에서 모든 레이어를 반드시 사용할 필요는 없으며, 프로젝트 규모와 복잡도에 따라 `widgets`, `features`, `entities` 레이어는 선택적으로 사용할 수 있다.

> **레이어 간에는 `shared` < `entities` < `features` < `widgets` < `pages` < `app` 과 같은 단방향 의존성 흐름을 유지하는 것이 핵심**이며, 하위 레이어에서 상위 레이어를 참조하는 것은 허용되지 않는다.
>
> 레이어 위치가 낮을수록 여러 곳에 참조되기에, 하위 레이어 변경은 더 큰 영향을 미칠 수 있다는 점도 고려해야한다.

### 슬라이스

- **각 레이어 내부에는 슬라이스라는 하위 구조가 존재**하며, 슬라이스는 레이어 안에서 비즈니스 도메인을 기준으로 코드를 분리하는 역할을 한다.
- 슬라이스의 이름은 표준화되어 있지 않으며, 도메인 특성에 따라 자유롭게 정의할 수 있다.
- 중요한 점은 **슬라이스 간에는 직접적인 의존이 없어야 하며, 각 슬라이스는 자신의 도메인 책임에만 집중**하도록 설계된다는 것이다.
- 이를 통해 슬라이스 단위의 응집도는 높이고, 도메인 간 결합도는 낮출 수 있다.

### 세그먼트

- 슬라이스 내부에서는 역할에 따라 세그먼트 단위로 코드를 나눌 수 있다.
- 세그먼트는 선택적인 구조이며, 슬라이스 내부 코드를 정리하기 위한 보조적인 기준으로 사용된다.
- 일반적으로 다음과 같은 세그먼트가 사용된다.

| **세그먼트** | **설명**                                                               |
| ------------ | ---------------------------------------------------------------------- |
| api          | 필요한 서버 요청                                                       |
| UI           | 슬라이스의 UI 컴포넌트                                                 |
| model        | 비즈니스 로직, 즉 상태와의 상호 작용. actions 및 selectors가 이에 해당 |
| lib          | 슬라이스 내에서 사용되는 보조 기능                                     |
| config       | 슬라이스에 필요한 구성값이지만 구성 세그먼트는 거의 필요하지 않음      |
| consts       | 필요한 상수                                                            |

### 공개 API

- FSD의 또 다른 특징 중 하나로, 공개 API를 활용하여 노출할 코드들을 명시한다.
- **공개 API는 각 슬라이스가 외부에서 노출해도 되는 인터페이스만 명시적으로 정의한 진입점**을 의미한다.

```ts
export { FavoriteButton } from "./ui/FavoriteButton";
export { FavoriteList } from "./ui/FavoriteList";

export {
  useFavoriteStore,
  selectIsFavorite,
  selectFavorites,
  selectIsFull,
  createFavoriteKey,
  MAX_FAVORITES,
} from "./model/favorite.store";

export type { FavoriteItem, SavedWeather } from "./model/favorite.store";
```

- 각 슬라이스와 세그먼트는 공개 API(index.ts)를 통해 외부에 노출할 기능만 명시적으로 정의한다.
- 공개 API에 포함되지 않은 파일이나 세그먼트는 슬라이스 내부 구현으로 간주되며 외부에서는 직접 접근하지 않도록 제한한다.
- 이를 통해 슬라이스 간 의존성을 명확하게 통제할 수 있으며,
  내부 구현 변경이 외부에 미치는 영향을 최소화하는 캡슐화를 달성할 수 있다.

## FSD 아키텍처를 적용하면서

- 간단한 날씨 정보 서비스를 구현하면서, FSD 아키텍처를 적용해 프로젝트 구조를 설계해보았다.
- 규모는 크지 않았지만, `app`, `pages`, `features`, `entities`, `shared`의 5개 레이어를 나누는 과정에서 구조와 책임에 대한 고민을 깊게 하게 되었다.

### 설계 접근 방식

![날씨 프로젝트 이미지](/images/posts/tech/fsd-with-wheather-app/feautre-entitiy-img.png)

- **먼저 요구사항을 기능 단위로 나열한 뒤 이를 어떤 도메인으로 묶을 수 있을지부터 정리**했다.
- 이후 각 도메인을 데이터 모델 중심인지 혹은 사용자 동작을 포함하는지에 따라 `entities`와 `features`로 구분했다.
- 이 기준에 따라 날씨 정보와 지역 정보는 `entities`로 지역 검색과 즐겨찾기 기능은 `features`로 분리하였다.
- 지역 검색이나 즐겨찾기 기능에서 지역 정보 `entities`를 참조하더라도, 레이어 의존성 규칙(`entities < features`)을 따르기 때문에 구조적인 문제는 발생하지 않았다.
- 페이지는 데이터 결합이나 비즈니스 판단을 최소화하고, 화면 단위의 조립 역할만 담당하도록 설계했다.
- 구조를 먼저 고정한 뒤, 각 슬라이스 내부를 `model`, `ui`, `api` 등의 세그먼트로 나누며 구현을 진행했다.

```
src/
├── app/                          # 앱 초기화
│   ├── layout/
│   │   └── Layout.tsx
│   ├── providers/
│   │   └── QueryProvider.tsx
│   ├── styles/
│   │   ├── global.css
│   │   ├── reset.css
│   │   └── theme.css
│   ├── App.tsx
│   ├── main.tsx
│   └── router.tsx
│
├── pages/                        # 페이지 컴포넌트
│   ├── home/
│   │   ├── HomePage.tsx
│   │   └── index.ts
│   └── favorite/
│       ├── FavoritePage.tsx
│       └── index.ts
│
├── features/                     # 사용자 기능 단위
│   ├── search/                   # 장소 검색 기능
│   │   ├── model/
│   │   │   ├── useSearch.ts
│   │   │   └── useSearchLocation.ts
│   │   ├── ui/
│   │   │   └── SearchBar.tsx
│   │   └── index.ts
│   ├── location-weather/         # 위치 기반 날씨 표시
│   │   ├── model/
│   │   │   └── useLocationWeather.ts
│   │   ├── ui/
│   │   │   ├── LocationWeatherDisplay.tsx
│   │   │   ├── TodayWeatherCard.tsx
│   │   │   └── WeatherDisplay.tsx
│   │   └── index.ts
│   └── favorite-weather/         # 즐겨찾기 기능
│       ├── model/
│       │   └── favorite.store.ts
│       ├── ui/
│       │   ├── FavoriteButton.tsx
│       │   ├── FavoriteCard.tsx
│       │   └── FavoriteList.tsx
│       └── index.ts
│
├── entities/                     # 비즈니스 엔티티
│   ├── location/                 # 위치 도메인
│   │   ├── api/
│   │   │   ├── queries/
│   │   │   │   ├── useGeocode.ts
│   │   │   │   └── useReverseGeocode.ts
│   │   │   ├── getGeocode.ts
│   │   │   └── getReverseGeocode.ts
│   │   ├── model/
│   │   │   ├── keys.ts
│   │   │   ├── location.store.ts
│   │   │   ├── types.ts
│   │   │   ├── useInitLocation.ts
│   │   │   └── useUserGrid.ts
│   │   ├── ui/
│   │   │   └── LocationDisplay.tsx
│   │   ├── korea_districts.json
│   │   └── index.ts
│   └── weather/                  # 날씨 도메인
│       ├── api/
│       │   ├── queries/
│       │   │   ├── useTodayWeather.ts
│       │   │   └── useWeatherByGrid.ts
│       │   └── getWeatherForecast.ts
│       ├── model/
│       │   ├── keys.ts
│       │   ├── parseWeatherData.ts
│       │   └── types.ts
│       ├── ui/
│       │   ├── HourlyWeather.tsx
│       │   └── TemperatureRange.tsx
│       └── index.ts
│
└── shared/                       # 공유 유틸리티
    ├── api/
    │   ├── client.ts
    │   ├── kakaoApi.ts
    │   └── weatherApi.ts
    ├── config/
    │   └── env.ts
    └── ui/
        ├── ErrorBoundary.tsx
        └── LoadingPage.tsx
```

### 엔티티 간 결합 흐름의 책임 분리

- 특히 지역 검색을 통해 위치 정보를 받아오고, 해당 위치를 기준으로 날씨 API를 요청하는 흐름을 구현하면서 고민이 가장 많았다.
- 날씨와 지역 엔티티를 함께 사용하는 위치 기반 날씨의 데이터를 `pages`에서 관리할지, `features`에서 관리할지에 대한 선택이 필요했다.
- `features`에서 관리하게 되는 경우 단순한 UI 동작의 결합을 넘어 "위치 선택 → 날씨 조회"라는 명확한 기능 흐름을 표현할 수 있었고, `pages`에 결합 로직을 두는 것보다 책임 분리가 명확하다고 판단하여 `features` 레이어에서 해당 흐름을 관리하도록 결정했다.

### 구현하면서 느꼈던 FSD

- FSD 아키텍처를 적용하며 가장 크게 느낀 점은, **모든 코드에 대해 끊임없이 역할과 책임을 질문하게 된다는 것**이었다.
- 특히 해당 코드가 단순히 데이터를 표현하는 모델인지, 아니면 사용자의 행동을 포함하는지에 따라 `entities`와 `features` 레이어를 구분하는 과정에서 많은 고민이 필요했다.
- 이러한 고민은 레이어 내부에서도 반복되었다. 단순 UI 출력인지, 상태나 비즈니스 로직을 포함하는지에 따라 `model`, `ui` 등 세그먼트로 다시 분리하는 과정이 필요했다.
- 요구사항에 대해서 **구현 방식에 대한 고민 만큼 역할과 책임 분류에 대해서도 집중**하게 되었다.

### FSD 적용 후 체감한 장단점

- FSD 아키텍처를 처음 학습하며 적용해본 결과, 장점과 단점이 비교적 명확하게 느껴졌다.

- **가장 와닿는 장점으로는, 도메인 단위로 기능이 명확히 분리되어 있어, 코드의 맥락을 파악하기 쉬웠다.**
- 각 슬라이스 내부의 기능들은 하나의 도메인 책임에 집중되어 있어, 특정 기능을 수정하거나 확인할 때 관련 코드의 범위를 빠르게 좁힐 수 있었다.
- 또한 기능이 어느 레이어와 슬라이스에 속하는지 명확하다 보니, “이 코드는 왜 여기에 있는가”에 대한 의문이 줄어들었다.
- 실제 협업을 진행하지는 않았지만, 이러한 구조라면 역할 분담이나 변경 범위를 논의하는 데에도 충분히 도움이 될 것이라 느꼈다.
- 만약 내가 다른 프로젝트에 중도 참여하는 상황이었다면, FSD로 설계된 구조가 훨씬 수월한 온보딩을 가능하게 해줄 것 같다는 생각이 들었다.

- **반면에 기능 위주 설계보다 설계에 필요한 비용이 상대적으로 훨씬 더 컸다.**
- 요구사항을 바탕으로 기능을 나누고, 이를 어떤 도메인과 레이어에 배치할지 판단하는 과정에서 생각보다 많은 시간을 할애하게 되었다.
- 특히 지금의 나와 같이 FSD에 익숙하지 않은 팀원이 함께하는 상황에서는, 실제 구현보다 “이 코드의 책임은 어디까지인가”를 고민하는 시간이 더 길어질 수 있다고 느꼈다.
- 프로젝트 규모가 크지 않은 경우에는 이러한 설계 비용이 상대적으로 크게 느껴질 수 있으며, 상황에 따라서는 구조가 과하다고 판단될 여지도 있다고 생각한다.

## 마무리

- 그동안 프로젝트를 진행하며 기능을 구현하는 데에는 익숙했지만, 코드의 역할과 책임을 구조 차원에서 고민해본 경험은 많지 않았다.
- 이번 프로젝트를 통해서 아키텍처 관점의 접근법을 경험할 수 있었다. 매우 유익한 시간들이었다.
- 또 아키텍처는 결과를 정리하는 단계가 아니라 구현 이전에 방향과 기준을 세우는 과정이라는 점을 다시금 인식하게 되었다.
- 다음 프로젝트에서는 이번에 경험한 고민을 바탕으로 FSD 아키텍처를 본격적으로 적용해 볼 예정이다.
