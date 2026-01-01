---
title: "뽀각코 프로젝트 정리"
description: "풀스택 데브코스 2기 사이드 프로젝트 뽀각코 정리"
date: "2024-07-20"
author:
  name: "ChangWoo"
coverImage: "/images/posts/project/pogakco/cover.png"
tag: ["뽀각코", "데브코스"]
---

## 개요

> **뽀각코 ( Pogakco )**
>
> - 프론트엔드 : React, TypeScript
> - 백엔드 : node.js, Express
> - 팀 : 4인 개발 ( 본인 포함 FE 2인, BE 2인 )
> - 개발 기간 : 2024-06-24 ~ 2024-07-19 ( 26일 )
> - 깃허브 : https://github.com/Pogakco
> - 배포 주소 : https://pogakco.site/ (배포 중단)
> - 소개 사이트 : https://www.notion.so/POGAKCO-cfc3ab1ae6324b8fbf04fc6ade2eea63

- 데브코스 풀스택 2기 사이드 프로젝트로 진행했던 뽀각코 프로젝트가 오늘로 끝이 났다.
- 정말 많은 애정을 가지고 진행한 프로젝트라 그 끝이 시원하기도, 섭섭하기도 하다.
- 개발자가 되기 위한 학습 여정중에, **그 어떤 순간보다 성장을 느낄 수 있었던 3주**였다.

## 프로젝트 소개

> **👏🏻 더 집중하고 싶으신가요? POGAKCO(뽀각코)를 만나보세요!**
>
> POGAKCO는 같은 타이머(=뽀모도로)를 통해 학습 사이클을 공유하고 생산성을 극대화할 수 있는 협업 서비스입니다.
>
> 자신만의 학습 스타일에 맞게 **집중 시간**, **쉬는 시간**, **큰 휴식 시간**, 그리고 **뽀모도로 사이클 횟수**를 설정하여 타이머를 생성하세요!
>
> 설정된 타이머는 다른 사용자와 **실시간으로 공유**됩니다!
>
> 함께하면 더 집중할 수 있고, **효율적인 학습 환경을 조성할 수 있는 POGAKCO로 여러분의 집중력을 높여보세요!**

![](https://velog.velcdn.com/images/changwoo/post/f05eda85-5a1b-4b5c-af7e-5ef11f6f4f98/image.gif)

## 담당 기능

> - UX,UI 디자인
> - 메인 페이지, 상세 페이지, Modal 구현
> - 방 생성, 참여, 삭제, 조회 API 연결
> - 공유 타이머 기능 구현
> - 실시간 참여중인 유저 기능 구현

### 공유타이머 기능 구현

![](https://velog.velcdn.com/images/changwoo/post/88f004f0-24ea-4f94-a979-0e9118ef4443/image.png)

- 프로젝트를 진행하면서 가장 고민을 많이 한 부분이다.
- **초기 기획** 단계에서는 서버에서 클라이언트에게 동일한 타이머 값을 제공하기 위해 서버에서 **타이머를 계산하고 매 초마다 제공하는 방식**이었다.
- 하지만 이러한 방식은 **공유타이머의 수가 증가할수록 서버의 부하가 급증**하는 문제를 발생시켰다.
- 이를 해결하기 위해 서버에서는 타이머 시작 값만을 제공하면,** 클라이언트에서 타이머 정보를 토대로 실시간 타이머를 구현하는 방식으로 수정**하였다.

```tsx
import { SOCKET_TIMER_STATUS } from "@/constants/socket";
import { ItimerStatus } from "@/models/timer.model";

export const getTimerTime = (
  differenceTime: number,
  focusTime: number,
  shortBreakTime: number,
  totalCycles: number,
  longBreakTime: number,
  playFocusAlarm: () => void,
  playShortBreakAlarm: () => void,
  playLongBreakAlarm: () => void,
  playEndAlarm: () => void
): ItimerStatus => {
  const cycleDuration = focusTime + shortBreakTime;
  const totalCycleTime = cycleDuration * totalCycles;
  const totalCycleAndLongBreakTime = totalCycleTime + longBreakTime;

  if (differenceTime >= totalCycleAndLongBreakTime) {
    if (isEndTime()) playEndAlarm();
    return {
      status: SOCKET_TIMER_STATUS.END,
      timerData: SOCKET_TIMER_STATUS.END_POINT,
    };
  } else if (differenceTime >= totalCycleTime) {
    if (isLongBreakTime(differenceTime, totalCycleTime)) playLongBreakAlarm();
    return {
      status: SOCKET_TIMER_STATUS.LONG_BREAK_TIME,
      timerData: totalCycleAndLongBreakTime - differenceTime,
    };
  }

  const remainderTime = differenceTime % cycleDuration;
  if (remainderTime < focusTime) {
    if (isFocusTime(remainderTime)) playFocusAlarm();
    return {
      status: SOCKET_TIMER_STATUS.FOCUS_TIME,
      timerData: focusTime - remainderTime,
    };
  } else {
    if (isShortBreakTime(remainderTime, focusTime)) playShortBreakAlarm();
    return {
      status: SOCKET_TIMER_STATUS.SHORT_BREAK_TIME,
      timerData: cycleDuration - remainderTime,
    };
  }
};

const isFocusTime = (remainderTime: number) => {
  return remainderTime === 0;
};
const isShortBreakTime = (remainderTime: number, focusTime: number) => {
  return remainderTime === focusTime;
};
const isLongBreakTime = (differTime: number, totalTime: number) => {
  return differTime === totalTime;
};
const isEndTime = () => {
  return true;
};
```

- 타이머 계산 코드의 주요 로직은 다음과 같다.
- 서버로부터 **시작 시간을 받고 클라이언트의 현재 시간과의 차이 값**을 구한다.
- 해당하는 차이값을 **뽀모도로 사이클(집중시간+휴식시간)로 나머지 연산**을 한다.
- 나머지 값이 **집중 시간 보다 작다면, 집중 시간** 상태가 되고, **크다면 휴식 시간** 상태가 된다.
- 차이 값이 **전체 사이클(뽀모도로 사이클 \* 뽀모도로 횟수)을 넘어서게 되면 대 휴식 시간** 상태가 된다.
- 차이 값이 **전체 사이클+대 휴식 시간을 넘어서게 되면 타이머가 종료** 상태가 된다

| 집중시간🤔                                                                                        | 휴식시간😪                                                                                        | 대 휴식시간😴                                                                                     |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| ![](https://velog.velcdn.com/images/changwoo/post/8cf907fd-2ed0-4c05-95b9-03566321aad2/image.gif) | ![](https://velog.velcdn.com/images/changwoo/post/6d2f9788-d2fd-4efa-8ee9-a65faff186ac/image.gif) | ![](https://velog.velcdn.com/images/changwoo/post/3f82f6e7-049f-4131-b1a0-b53dcf4727e4/image.gif) |

> **서버의 역할을 클라이언트에 위임함으로 부하를 줄일 수 있었고 성능적 이점**을 얻을 수 있었다.
>
> **결과적으로 접근 방식을 달리 하여 더 많은 사용자를 수용**할 수 있게 되었다.

## 4L 회고

### Liked

**1. 명확한 문서화**

- 개발 전, **와이어 프레임을 작성하여 프론트 엔드와 백 엔드가 요구하는 기술적 요구사항을 우선적으로 나타내었다.**
- 해당하는 **기능 명세를 통해 백 로그와 API 명세서를 추가로 작성함으로 혼동 없이 개발**을 진행할 수 있었다.
- 이렇게 **처리해야할 업무를 리스트화 하니 필수 구현 기능과 부가 기능의 우선 순위를 지정**하는데 큰 도움이 되었고 3주라는 짧은 시간 이었지만 필수 구현 기능에 집중하여 성공적으로 프로젝트를 마칠 수 있었다.

**2. 코어타임을 활용한 지속적인 소통**

- **주중 13시-15시 게더타운을 활용하여 팀원들과 소통하는 시간**을 가졌다.
- 간단한 스크럼을 통해 서로의 진행상황을 공유하였으며, 이를 통해 요구사항이나 피드백을 즉시 공유하여 반영할 수 있었다.
- 또한 **매일 열정있는 팀원들과의 커뮤니케이션은 큰 자극**이되어 프로젝트의 좋은 동기부여가 되었다.

**3. Git Project를 통한 칸반보드 업무 관리**

- **Git Project의 칸반보드**를 통해 개발 진행 상태를 Todo, InProgress, PR Requested, Done으로 구분지어 진행하였다.
- 해야 할 **업무를 명확히 인지**할 수 있었고, 팀원의 **개발 진행 상황도 한눈에 파악** 할 수 있어 업무 분담에있어 굉장히 효율적었다.

### Learned

**1. FE-BE, FE-FE 협업 스킬**

- 이번 뽀각코 프로젝트를 진행하면서, **협업에 필요한 다양한 소프트 스킬과 하드 스킬들을 배울 수 있었다.**
- 특히 같은 FE-FE간 협업에 있어, 경험이 많은 동료와 함께하니 **효과적으로 공통 컴포넌트를 구현하는 방법, 프로젝트 초기 설정** 등 정말 값진 기술들을 습득할 수 있었다.
- FE-BE간 협업에도, API 명세를 통해 백엔드 동료와 소통하며 **요구사항에 맞게 코드를 구현하고 수정하는 방법**도 배우게 되었다.

**2. SocketIO, tanstackQuery 등 새로운 기술의 습득**

- 뽀각코의 **핵심 기능인 공유타이머 부분을 담당하게 되어 Socket-iO 기술을 학습**하게 되었다.
- 프로젝트 내내 소켓 상태를 어떻게 처리하면 좋을지와 **효과적으로 공유타이머를 동기화 하는 방법에 대한 고민**을 했고, 이를 해결하는 과정에서 많은 성장을 하게 되었다.
- 강의로만 학습했던 **tanstackQuery를 적용하면서 캐싱 관리, 동기화, 전역 변수로의 활용 등 그 장점을 체감**할 수 있었다.

### Lacked

**1. 기능이 우선시 되어진 코드**

- 주어진 시간이 많지 않아 **기능 구현을 최대한 빠르게 진행해야겠다는 조바심**이 있었다.
- 그 과정에서, **동료를 설득하기 쉬운 협업을 위한 코드보다 당장의 기능구현이 우선순위**가 되었다.
- 조금의 여유가 있었더라면 더 고민하여 가독성 있고 재사용 가능한 좋은 코드를 작성할 수 있지 않았을까 아쉬움이 든다.

**2. 부족한 타입스크립트 능력**

- 개발과정에서 발생하는 타입오류를 해결하기 위해 상당히 많은 시간을 할애하였다.
- 특히 **중복된 타입을 처리할 때 적합한 유틸리티 타입**을 찾거나, **라이브러리 자체에서 지원하는 반환 타입을 능숙하게 처리하지 못한 부분에서 능력 부족**을 느꼈다.
- 타입스크립트에서 제공하는 **다양한 레퍼런스의 학습 필요성**을 느꼈다. 지금 내 수준에 맞는 강의를 찾아야겠다.

### LongedFor

**1. 문서화 기술 향상**

- 문서화의 중요성을 통해, **요구사항을 구체적으로 파악하고 정의하는 실력 또한 개발자로서 중요한 역량**임을 깨달았다.
- 스스로 느끼기에 해당하는 부분이 아직 부족하다고 생각이 든다.
- 그렇기에 **문서화 실력 향상을 위해 벨로그에 기술 정리 게시물을 자주 포스팅** 해보려고 한다.

**2. 커밋 관리**

- 해당 프로젝트의 **git 관리는 feature 브랜치 분리와 merge**를 통해 진행하였다.
- 진행하면서 크게 불편한 점은 없었지만 그래도 커밋이 쌓여갈수록 히스토리가 지저분해진다는 느낌이 들었다.
- 그렇기에 다음에는 **Squash와 같은 깃 기법을 활용**해 커밋을 관리해보려고한다.

**3. 더 완벽한 뽀각코**

- 공식적인 프로젝트 기간은 7월19일부로 끝났지만, 애정하는 프로젝트인만큼 꾸준히 발전시키고 싶다.
- 제한된 기간으로 미뤄졌던 **부가 기능이나 코드 리팩토링, 그리고 약간의 버그 수정**까지 아직 뽀각코는 무궁무진하다.
- 뽀각코가 나를 성장시켜준만큼, 나도 뽀각코를 더 완벽하게 만들어주고싶다.

## 마치며

- **협업 경험에 목말라 신청했던 데브코스 과정에서, 뽀각코는 그 의미를 찾아준 정말 단비 같은 프로젝트**였다.
- 열정과 능력있는 동료들이 가진 영향력을 통해 **개발자로서 기술적으로, 기술 외적으로도 크게 성장할 수 있는 시간**이었다.
- 팀 프로젝트의 첫 단추가 너무나 만족스럽게 끼워졌다. 뽀각코팀 정말 고생하셨고 또 정말 감사합니다😃

  <img src="https://velog.velcdn.com/images/changwoo/post/f419049e-2c36-4bd6-9ee7-c9bafe27984e/image.png" alt="이미지" width="500"/>
