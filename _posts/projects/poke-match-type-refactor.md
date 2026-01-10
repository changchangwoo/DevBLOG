---
title: "포켓몬 상성 계산기 프로젝트 버전업"
description: "방문자 수 10배 이상 증가시킨 토이 프로젝트 버전업 과정"
date: "2025-07-19"
author:
  name: "ChangWoo"
coverImage: "/images/posts/project/poke-match-type-refactor/cover.png"
tag: ["포켓몬 상성 계산기", "토이"]
---


## 개요
> **포켓몬 약점 계산기 (Poke-match-type)**
> 
> - 프론트엔드 : React, TypeScript
>
> - 팀 : 1인 개발
>
> - 깃허브 :https://github.com/changchangwoo/POKE-MATCH-TYPE
>
> - 배포주소 : https://poke-match-type.site

- 신입 개발자로서 입사 이후, 회사 업무에 정신 없이 적응하다 보니 어느덧 6개월이 흘렀다.
- 회사 생활은 전반적으로 마음에 들었지만 바닐라 JS 기반의 프로젝트를 진행하다 보니 **모던 프레임워크에 대한 감각을 잃어버릴까 조바심**이 났다.
- 그러다 문득, 이전에 진행했었던 포켓몬 약점 계산기가 눈에 들어왔다.
- 미완성의 아쉬움이 남았기도 했던 프로젝트였기에 고민없이 다시 꺼내들었다.

### 구현 목표

> 코드 리팩토링
>
> 상성 퀴즈, 상성 테이블 페이지 추가
>
> 다국어 및 글로벌 테마
>
> 메가 진화 및 폼 체인지 검색

- 온전히 프로젝트에 몰입할 수 없는 환경이었기에 **완벽함 보단 현실적 구현 목표**를 세우고 접근했다.

## 구현
### 코드 리팩토링

- 1년만에 코드를 다시보니 **코드에 대한 이해가 하나도 안됐다.**
- 당시에도 1인 개발이었고, 짧은 시간내 구현했었지만 그렇더라도 좀 심했다;

```jsx
  const { data: typeData, isLoading, error } = useFetchDetailType(typeNo);

  useEffect(() => {
    if (!typeData || isLoading || error) return;

    const fetchData = async () => {
      let result = await getDetailType(typeData);
      if (selectedAbility && selectedAbility !== "") {
        getAddAbility(result, selectedAbility);
      }
      let groupResult = await getGroupType(result);
      setTypeRelations(groupResult);
    };
    fetchData();
  }, [MatchTypes, selectedAbility, typeData, isLoading, error]);
```

- **tanstack-query의 상태 관리 기능을 충분히 활용하지 못하고, 데이터 가공을 useEffect 내부에서 처리하는 비효율적인 구조**였다.

```jsx
const TypeCheckwithCharacter = ({ types, selectedAbility, setSelectedAbility}: TypeCheckProps) => {}
```

- 욕심 그득한 **두 가지의 관심사를 하나의 컴포넌트로 처리하도록 하는 코드**도 보였다.
- 또 의도를 알 수 없는 변수명 덕분에 한참 시간을 쓰다보니 혹시 1년 후에 나에 대한 견제를 하려고 했던걸까 하는 생각도 들었다.

> **API 데이터를 처리하는 로직들은 모두 tanstackQuery 내부에서 동작하여 반환하도록 수정하**였고, **컴포넌트의 단일 책임 원칙을 수행하도록 변경**하였다. 
>
> 또한 **정적 텍스트들은 전부 상수화** 하였으며 이를 통해 추후 다국어 지원에 있어서 통합적인 관리가 가능해졌다.

### 1. 상성 퀴즈 페이지 추가
<p align="center">
<img src="https://velog.velcdn.com/images/changwoo/post/e3002700-6bc3-4955-8d8f-5f77208924e1/image.gif" width="50%" style="display:block; margin:auto;">
</p>

- 단순 ‘약점 계산‘ 을 도와주는 서비스가 아닌, **초보자를 위한 포켓몬 상성 이해를 도와주는 서비스로의 확장**을 희망하며 퀴즈페이지를 추가했다.
- 총 세가지 유형으로 설계하였고, 문제 및 보기는 모두 랜덤이다.

> **퀴즈 설정 로직**
>
> 1. **난수를 통해 랜덤 유형 접근**
> 2. 포켓몬 도감에서 **도감 번호 랜덤 추출 후 API 요청**
> 3. 발췌한 포켓몬 타입에 맞춘 약점 계산 로직 동작으로 **타입별 상성 리스트 생성**
> 4. 나올 수 있는 **질문 배수를 (x0 —- x4) 중 랜덤으로 추출 후 정답 설정**
> 5. 설정된 질문 배수를 제외한 **나머지 배수에서 랜덤으로 추출 후 보기 설정**
> 

<table>
  <thead>
    <tr>
      <th align="center">유형1</th>
      <th align="center">유형2</th>
      <th align="center">유형3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">
        <img src="https://velog.velcdn.com/images/changwoo/post/665c216a-f586-4f69-96be-a32b6dca5bae/image.png" width="100%" /><br />
        <strong>주어진 포켓몬의 특정 배수에<br />데미지를 가하는 공격 타입 고르기</strong>
      </td>
      <td align="center">
        <img src="https://velog.velcdn.com/images/changwoo/post/cb03d68e-e354-4fed-a593-0d0d5a001bca/image.png" width="100%" /><br />
        <strong>부등호 방향에 적합한<br />blank 안에 들어갈 타입 고르기</strong>
      </td>
      <td align="center">
        <img src="https://velog.velcdn.com/images/changwoo/post/ae8c9a04-d623-44df-92ee-67fe775b2bfd/image.png" width="100%" /><br />
        <strong>타입 공격에 대해 방어 타입을 가진<br /> 포켓몬의 피해량 고르기</strong>
      </td>
    </tr>
  </tbody>
</table>

```jsx

/* Quiz.tsx */
    <div css={quizContainer}>
      <h1>{text.QUIZ.TITLE}</h1>
      {(() => {
        switch (section) {
          case 0:
            return <QuizReady setSection={setSection} />;
          case 1:
            return <QuizIntro setSection={setSection} />;
          case 2:
            return (
              <QuizMain setSection={setSection} />
            );
          case 3:
            return <QuizEnd progressArr={progressArr} setSection={setSection} setProgressArr={setProgressArr}/>;
          default:
            return <div>{text.QUIZ.ERROR}</div>;
        }
      })()}
    </div>
    
/* QuizMain.tsx */
      <div css={matchCardContainer}>
        {(() => {
          switch (quizType) {
            case 0:
              return (
                <QuizType0_damageEffectiveness /> // +props ...
              );
            case 1:
              return (
                <QuizType1_quizTypeInference /> // +props ...
              );
            case 2:
              return (
                <QuizType2_typeDescription /> // +props ...
              );
            default:
              return <div>{text.QUIZ.ERROR}</div>;
          }
        })()}
        {isNext && (
          <button css={nextButton} onClick={handleNextButton}>
            {text.QUIZ.NEXT}
          </button>
        )}
      </div>
      {alertType && <QuizAlert quizType={alertType} answerText={answerText} />}
```

- 복잡한 라우팅보다는, **상태 기반 섹션 분기로 구성해 전체 흐름을 단순하게 유지**하도록 하였다.
- 추후 유저의 퀴즈 개별 접근과 같은 **확장이 필요하다면 그 때 리팩토링**을 진행해도 될 것 같았다.

```jsx
/* useGetDetailPokemonForQuiz.ts */
  useEffect(() => {
    let isCancelled = false;
    const useFetchDetailPokemonQuiz = async (name: string = "") => {
			/* ... */
      const fetchDatas = await fetchDetailPokemon(String(randomNum));
      // 포켓몬 정보 데이터 요청
      const fetchDetailTypeData = await fetchDetailType(typeNo);
      // 포켓몬 타입 데이터 요청
      const circulateTypeData = await getDetailType(fetchDetailTypeData);
	  // 요청한 타입 데이터를 바탕으로 상성 계산
      let groupResult = await getGroupType(circulateTypeData);
      // 상성 계산 데이터 그룹화
      if (isCancelled) return;
      // 언마운트 되어진다면 상태 변경 취소
      setAnswerIdx(shuffleResult.findIndex((item) => item.no === correct.no));
      setGroupResult(groupResult);
      setMatchDatas(matchDatas);
      setQuizNum(quizNum);
      setQuetstionArr(shuffleResult);    };
     return () => {
      isCancelled = true;
    }; // 클린업 함수
  }, [progress]);
```
> **UseEffect 내부 비동기 함수의 비동기 경쟁 조건 이슈**
> - 퀴즈 데이터는 매 문제마다 새롭게 요청되어야 하기 때문에**tanstack-query가 아닌 `useEffect` 안에서 비동기 요청을 수행**했다.
> - 하지만 의존을 가진 progress가 업데이트 되기 전, **이전 값을 기준으로 한 비동기 요청이 먼저 처리되는 경우가 발생**했고
> - 이로인해 이전 값을 기반으로 퀴즈가 생성되는 **비동기 경쟁 조건** 문제에 빠졌다.

⇒ 상태를 기준으로 동작하는 비동기 로직에서는 항상 **컴포넌트 언마운트 여부나 상태의 최신성**을 고려한 `cleanup` 처리가 필요하다는 것을 다시 한번 상기시킬 수 있었다.
### 2. 다국어 및 테마

<table>
  <thead>
    <tr>
      <th align="center">다국어</th>
      <th align="center">테마</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">
        <img src="https://velog.velcdn.com/images/changwoo/post/92c5d9e1-4998-45ff-8ded-4e05d2b63dfb/image.gif" width="100%">
      </td>
      <td align="center">
        <img src="https://velog.velcdn.com/images/changwoo/post/f73a43e2-ee66-413e-a24d-1de7483a865b/image.gif" width="100%">
      </td>
    </tr>
  </tbody>
</table>

- 사용자 편의 기능으로 **다크모드-라이트모드에 해당하는 테마 변경 기능을 추가**했다.
- 또 동일한 로직을 활용하는 다국어 지원 기능도 개발하였다. 
- 프로젝트 사이즈가 크지 않아 zustand 같은 라이브러리를 사용하기보다는 **contextAPI를 활용**하였다.

```jsx
/* App.tsx */
        <ThemeContext.Provider value={{ theme, setTheme }}>
          <Navigation />
        </ThemeContext.Provider>
/* globalStyles.ts */
const themes: Record<TTheme, TThemeStyles> = {
  light: {
    point: "#DE7038",
/* 라이트모드 색상 값*/
  },
  dark: {
    point: "#AEC6B5",
/* 다크모드 색상 값 */
  },
};
export const globalStyles = (themeMode: keyof typeof themes = "light") => {
  const theme = themes[themeMode];
  return css`
    :root {
      /* 컬러 */
      /* --point: #eb9191; */
      --point: ${theme.point}; // 포인트 색
      --primary: ${theme.primary}; // 배경 바탕
      --background: ${theme.background}; // 디폴트(화이트)
      --text: ${theme.text}; // 디폴트(블랙)
      --border: ${theme.border}; // border 배경
      --highlight: ${theme.highlight}; // 하이라이트 색상
      --skeleton: ${theme.skeleton}; // 스켈레톤 색상
	/*...*/
/* Navigation.tsx > SettingModal.tsx > Theme.tsx*/
  const { theme, setTheme } = useContext(ThemeContext);

  const handleThemeBtn = (
    e: React.MouseEvent<HTMLButtonElement>,
    data: TThemeData
  ) => {
    e.stopPropagation();
    setTheme(data);
    localStorage.setItem(
      "theme",
      JSON.stringify({
        ...data,
      })
    );
  };

  {/* 네비게이션 내 버튼으로 Theme context 변경 */}

```
- 특히, `Theme`를 활용함에 있어 **globalStyle로 정의한 css의 var만 바꾸도록 설정**하니, ThemeContext Proivder의 범위를 설정 페이지가 있는 네비게이션으로만 한정할 수 있었다.
- 이를 통해 **DOM 재렌더를 최소화 한 채로 훨씬 빠른속도로 테마 변경이 가능**하였고 JSON 코드만 추가하면 되니 확장도 용이했다.

### 3. 포켓몬 폼 별 데이터
<p align="center">
<img src="https://velog.velcdn.com/images/changwoo/post/05ef4275-e5ec-4735-a056-8956fdbcebd9/image.gif" width="50%" style="margin: auto;">
</p>

- 특정 포켓몬은 폼에 따라 타입을 달리하기에, 폼 별 약점 계산을 제공하는 것은 필수적이다.
- 하지만 pokeAPI의 폼 체인지에 대한 **데이터는 한정적이고 원하는 형태의 추출이 어려웠다.**
- 반면 한국 공식 포켓몬 도감은 원하는 형태의 정보를 정리하고 있었다
- 그래서 **한국 공식 사이트를 기준으로, pokeAPI 데이터를 매핑하는 방식으로 설계**하였다.
- 다만 양 데이터는 완벽하게 일치하지 않았기에 다음과 같은 매핑 기준을 세웠다.

> 
> 1. 메가 진화, 거다이 맥스, 리젼 폼등 **폼 네이밍이 명확히 고정된 경우 우선 필터링**
> 2. 이후 양 데이터에서 **남은 폼 개수 비교**
> 3. 개수 일치시 매핑 수행, 그렇지 않으면 is_visible을 통해 데이터 숨김
> 

- 우선, 한국 공식 포켓몬 도감은 API를 제공하지 않았기에, **웹 스크래핑을 통해 도감 데이터를 추출**하였다.
- 영문 데이터는 pokeAPI를 통해 개별적 추출 후 추가해주었다
    
    ```jsx
      {
        "no": 487,
        "name": {
          "kor": "기라티나(어나더폼)",
          "eng": "giratina"
        },
        "varieties": {
          "kor": ["기라티나(오리진폼)"],
          "eng": ["Giratina (Origin Forme)"]
        }
      },
    ```
    
- pokeAPI에서는 특정 포켓몬 폼에 대한 요청을 하면, 다음과 같은 형식의 데이터를 반환한다.

```jsx
/* 데이터 형식 */
 "varieties": [
    {
      "is_default": false,
      "pokemon": {
        "name": "charizard-mega-x",
        "url": "https://pokeapi.co/api/v2/pokemon/10034/"
      }
    }
  ]
```

- 이 중, **리전폼이나, 메가진화, 거다이맥스의 경우 폼네임이 고정된 값으로, 네임스페이스 가 동일하여 우선 매핑**하도록 하였다.

```jsx
/* 고정 폼 매핑 */  
  export const getSpeciesTranslate = (
  name: string,
  language: TLanguageType
): string => {
  if (/-mega-x$/.test(name)) return speciesData["megaX"][language]
  if (/-mega-y$/.test(name)) return speciesData["megaY"][language]
  if (/-mega$/.test(name)) return speciesData["mega"][language]
  if (/-gmax$/.test(name)) return speciesData["gmax"][language]
  if (/-galar$/.test(name)) return speciesData["galar"][language]
  if (/-alola$/.test(name)) return speciesData["alola"][language]
  if (/-hisui$/.test(name)) return speciesData["hisui"][language]
  if (/-paldea$/.test(name)) return speciesData["paldea"][language]
  if (/-hoenn$/.test(name)) return speciesData["hoenn"][language]
  if (/-sinnoh$/.test(name)) return speciesData["sinnoh"][language]
  if (/-unova$/.test(name)) return speciesData["unova"][language]
  if (/-kalos$/.test(name)) return speciesData["kalos"][language]
  if (/-primal$/.test(name)) return speciesData["primal"][language]
  if (name === "default") return speciesData["default"][language]
  return name; 
};
```

- 이후 pokeAPI와 스크래핑한 도감 데이터를 비교하며 **고정 폼을 제외한 나머지 폼(=개별폼)의 개수를 비교하고 개수가 일치한다면 데이터를 매핑**하도록 하였다.
- 개수가 일치하지 않는 경우 매핑을 하지 않는 이유는 타입이 동일한 이벤트폼까지 pokeAPI에서 제공하였기에 생략해도 상관없을 것 같았다. ( 지우모자 피카츄 등 )
- 한글 도감 데이터는 폼의 대한 기준일뿐, **실제 데이터는 현재 설정 언어에 맞춘 도감 데이터가 매핑이 되어진다.**

```jsx
export const getFilterFixVarieties = (
  pokeDexHash: Map<number, IPokeDex>,
  no: string,
  fetchVarietiesData: any,
  language: TLanguageType
) => {
  const pokeDexData = pokeDexHash.get(Number(no));
  const cloneFetchVarietiesData = JSON.parse(
    JSON.stringify(fetchVarietiesData)
  );
  const filterfetchVarieties = getFilterfetchVarieties(
    cloneFetchVarietiesData,
    language
  );
  // pokeAPI에서 추출한 폼 개수
  const filterPokeDexVarieties = getFilterPokeDexVarieties(
    language,
    pokeDexData
  );
  // 포켓몬 도감 에서 추출한 폼 개수
  const originData = fetchVarietiesData;
  // 두 배열의 개수가 일치하는 경우
  if (filterPokeDexVarieties?.length === filterfetchVarieties.length - 1) {
  // pokeAPI에는 기본값도 개수로 들어가 있기에 1제거
    filterPokeDexVarieties?.forEach((el) => {
      if (el.name === "더미") {
        originData[el.idx].is_visible = false;
        return;
      }
      originData[el.idx].pokemon.name = el.name;
    });
  }
  // 두 배열의 개수가 일치하지 않는 경우 (= 폼 데이터 삭제)
  // 값은 전부 그대로 유지하면서 isVisibile만 false로 변경
  else {
    filterfetchVarieties.forEach((el) => {
      if (el.idx === 0) return; // 기본형은 제외
      originData[el.idx].is_visible = false;
    });
  }

  return originData;
};
```
- **pokeAPI의 개별 폼 순서와 포켓몬 도감 개별 폼 순서가 일치하기 때문에 가능한 방식**이었다.
- pokeAPI만으로 한계가 있기에, **새로운 기준을 잡고 데이터를 추출함으로 구현**하였다. 고민을 많이했고 결국 목표는 이뤘지만 다음과 같은 고민거리가 남았다.
> - 코드가 너무 불안전하다. 폼 순서 일치나 네이밍 규칙 같은 ‘암묵적 신뢰’ 위에 로직을 올렸다.
> - pokeAPI에 너무 종속되어있었다. 다른 API를 찾아 볼 순 없었을까?
> - 아니면, 오히려 요청을 더 많이보내더라도 pokeAPI로서만 처리하는게 맞았을까?
> - 사실 AI가 있기에 1000개 가량의 데이터는 정적으로 채우는것이 훨~씬 빨랐을텐데 굳이 코드로 접근해야했을까?

## 마치며
![](https://velog.velcdn.com/images/changwoo/post/bd9b031b-a34d-410e-8930-18b638cb7328/image.png)

- 그래도 버전 업 이후, **방문객 수가 10배 넘게 늘었다**. 
(일평균 5명에서 70명 된거지만 어그로 죄송합니다ㅠㅠㅎ) 
- 2주에서 3주를 예상했지만 한달이 아득히 넘게 걸렸다.
- 회사 업무와 토이 프로젝트를 병행하기에 나는 너무 나약했다.
- 그럼에도 **과거의 내 코드를 다시 만날 수 있었던 좋은 기회**였다.
- 뭔가, 훗날에 또 한번 부끄러워하며 더 많은 것을 고칠것만 같다.


> 초기 구현은 [효과는 굉장했다! 포켓몬 약점 계산기 만들기](https://velog.io/@changwoo/%ED%9A%A8%EA%B3%BC%EB%8A%94-%EA%B5%89%EC%9E%A5%ED%96%88%EB%8B%A4-%ED%8F%AC%EC%BC%93%EB%AA%AC-%EC%95%BD%EC%A0%90-%EA%B3%84%EC%82%B0%EA%B8%B0) 에서 확인 가능합니다.

