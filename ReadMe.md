# About Recoil

# 공식 문서 [링크](https://recoiljs.org/ko/)

![image](https://miro.medium.com/max/2000/1*0SkjAGdVWYe4ja5Qu4DeJg.jpeg)

> **리코일은 리액트를 위한 상태관리 라이브러리로 페이스북에서 제작을 하고있으며, 현제 많은 프론트엔드 개발자들이 기대하고 있는 기술이기도 하다.**

이 레포지토리는 어떻게하면 리액트에서 리코일을 잘 사용할 수 있을까에 대한 고민의 흔적이다.
`Redux`, `MobX`등 다양한 상태관리 라이브러리를 써봤지만 둘다 결국에는 완전히 나를 만족시키지 못했다...(라이브러리에 어떠한 문제가 있었던것은 아니다.) 그저 상태관리 패턴들이 맘에 들지 않았고 나는 꾸역꾸역 쓸 수 밖에 없었다. 그러던중 **페이스북이 새로운 솔루션을 제시했다.** 그것이 바로 리코일이고 나는 리코일에 대해서 이 레포지토리에 모두 담는것이 목표이다.

<hr>

## 카운터

> (이 레포에서)처음으로 만든 리코일 프로젝트이다.

[링크](https://github.com/Hong-JunHyeok/Recoil_Study/tree/master/recoil_js_counter)

![image](https://user-images.githubusercontent.com/48292190/115545218-81db3b80-a2de-11eb-9535-5c9949f8bbe5.png)

# 🤨 리코일에 대해서...

# 동기

기존에 리액트 자체적으로 지원하던 상태관리 기능을 사용해도 되지만 단점이 있다.

- 컴포넌트의 상태는 공통된 조상으로 넣어야 공유할 수 있지만, 이것은 거대한 트리가 포함되어 다시 렌더링을 해야한다.
- Context는 단일 값만 저장할 수 있으며 자체적인 소비자가 있는 정의되지않은 집합 값은 저장할 수 없다.
- 이 두가지가 트리의 윗부분 (state가 존재하는 곳)부터 트리의 잎 (state가 사용되는 곳)까지의 코드 분할을 어렵게한다.

그래서 이를 보완하고자 Facebook에서는 Recoil이라는 라이브러리를 개발했다.

Recoil은 직교하지만 본질적인 방향 그래프를 정의하고 React 트리에 붙인다. 다음과 같은 접근 방식을 통해 상태 변화는 이 그래프의 뿌리(atoms라고 부르는)에서 순수함수(selectors라고 부르는 것)를 거쳐 컴포넌트로 흐른다.

**리코일의 장점**

-우리는 공유되는 상태가 React 내부 상태와 동일한 간단한 get/set 인터페이스를 갖는 boilerplate-free API를 얻는다.(필요한 경우 reducers 등으로 캡슐화할 수 있다.)

-우리는 Concurrent 모드와 추후 사용가능한 다른 새로 제공되는 React의 기능과의 호환 가능성을 갖는다.

-상태 정의는 증분적이고 분산되어 있어 코드 분할이 가능하다.

-상태를 사용하는 컴포넌트를 수정하지 않고 파생된 데이터로 상태를 대체할 수 있다.

-파생된 데이터는 그것을 사용하는 구성 요소를 수정하지 않고 동기식 데이터와 비동기식 사이에서 이동할 수 있다.

-우리는 탐색을 일급 개념으로 취급할 수 있고 심지어 링크에서 상태 전환을 인코딩할 수도 있다.

-역호환성 방식으로 전체 애플리케이션 상태를 유지하기가 쉬우므로 지속된 상태가 애플리케이션 변경에서 살아남을 수 있다.

# 주요 개념

**Atoms는 컴포넌트가 구독할 수 있는 상태의 단위다. Selectors 가 이 상태를 동기 또는 비동기식으로 변환한다.**

## Atoms

Atoms는 상태의 단위다. 그것들은 업데이트와 구독이 가능하다. atom이 업데이트되면 각각의 구독된 컴포넌트는 새로운 값으로 다시 렌더링 된다.

```js
const fontSizeState = atom({
  key: "fontSizeState",
  default: 14,
});
```

Atoms는 디버깅, 지속성, 그리고 모든 atom들의 맵을 볼 수 있는 특정 고급 API에 사용되는 고유한 키가 필요하다. **두 atom이 같은 키를 갖는 것은 오류이기 때문에 그것들이 전역적으로 고유하다는 것을 확실하게 해야 한다.** React 컴포넌트의 상태처럼 기본값 또한 가지고 있는다.

컴포넌트에서 atom을 읽고 쓰려면 useRecoilState라는 흑을 사용한다. React의 useState와 같지만 이제는 다음과 같은 컴포넌트들 사이에서 상태를 공유할 수 있게 되었다.

```js
function FontButton() {
  const [fontSize, setFontSize] = useRecoilState(fontSizeState);
  return (
    <button
      onClick={() => setFontSize((size) => size + 1)}
      style={{ fontSize }}
    >
      Click to Enlarge
    </button>
  );
}
```

이제 버튼을 클릭하면 fontSize가 1씩 증가하는 모습을 볼 수 있다.

## Selectors

Selector는 atom이나 다른 selector를 입력으로 받아들이는 순수한 함수다.
