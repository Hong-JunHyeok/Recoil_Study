# About Recoil

# 공식 문서 [링크](https://recoiljs.org/ko/)

![image](https://miro.medium.com/max/2000/1*0SkjAGdVWYe4ja5Qu4DeJg.jpeg)

> **리코일은 리액트를 위한 상태관리 라이브러리로 페이스북에서 제작을 하고있으며, 현제 많은 프론트엔드 개발자들이 기대하고 있는 기술이기도 하다.**

이 레포지토리는 어떻게하면 리액트에서 리코일을 잘 사용할 수 있을까에 대한 고민의 흔적이다.
`Redux`, `MobX`등 다양한 상태관리 라이브러리를 써봤지만 둘다 결국에는 완전히 나를 만족시키지 못했다...(라이브러리에 어떠한 문제가 있었던것은 아니다.) 그저 상태관리 패턴들이 맘에 들지 않았고 나는 꾸역꾸역 쓸 수 밖에 없었다. 그러던중 **페이스북이 새로운 솔루션을 제시했다.** 그것이 바로 리코일이고 나는 리코일에 대해서 여기에 모두 담는것이 목표이다.

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

**상위의 atom 또는 selector가 업데이트되면 selector 함수가 재평가된다. 컴포넌트들은 selector를 atom처럼 구독할 수 있고 selector가 변경될 때 다시 렌더링이 이루어진다.**

Selector는 상태를 기반으로 하는 파생 데이터를 계산하는 데 사용된다.

```js
const fontSizeLabelState = selector({
  key: "fontSizeLabelState",
  get: ({ get }) => {
    const fontSize = get(fontSizeState);
    const unit = "px";

    return `${fontSize}${unit}`;
  },
});
```

get속성은 계산될 함수다. get인자를 통해 atom의 값이나 다른 selector에 접근할 수 있다.

```js
function FontButton() {
  const [fontSize, setFontSize] = useRecoilState(fontSizeState);
  const fontSizeLabel = useRecoilValue(fontSizeLabelState);

  return (
    <>
      <div>Current font size: ${fontSizeLabel}</div>

      <button onClick={setFontSize(fontSize + 1)} style={{ fontSize }}>
        Click to Enlarge
      </button>
    </>
  );
}
```

# 설치

[이 문서](https://recoiljs.org/ko/docs/introduction/installation)를 참고해주세요!

# RecoilRoot

"전역"적으로 상태를 관리해야하니까 `RecoilRoot`가 필요하다.

RecoilRoot의 위치는 루트 컴포넌트가 제일 좋다.

`index.js`예시이다.

```js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { RecoilRoot } from "recoil";

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById("root")
);
```

이러면 전역적으로 recoil을 사용할 준비가 된것이다.

# Atom

Atom은 상태(state)의 일부를 나타낸다. Atoms는 어떤 컴포넌트에서나 읽고 쓸 수 있다. atom의 값을 읽는 컴포넌트들은 암묵적으로 atom을 구독한다. 그래서 **atom에 어떤 변화가 있으면 그 atom을 구독하는 모든 컴포넌트들이 재 렌더링 되는 결과가 발생할 것이다.**

```js
const textState = atom({
  key: "textState", // atom의 고유 아이디
  default: "", // 기본 값
});
```

이제 컴포넌트가 atom을 읽고 쓰게 하기 위해서는 useRecoilState()를 아래와 같이 사용하면 된다.

```js
function CharacterCounter() {
  return (
    <div>
      <TextInput />
      <CharacterCount />
    </div>
  );
}

function TextInput() {
  const [text, setText] = useRecoilState(textState);

  const onChange = (event) => {
    setText(event.target.value);
  };

  return (
    <div>
      <input type="text" value={text} onChange={onChange} />
      <br />
      Echo: {text}
    </div>
  );
}
```

# Selector

Selector는 파생된 상태(derived state)의 일부를 나타낸다. **파생된 상태는 상태의 변화다.** 파생된 상태를 어떤 방법으로든 주어진 상태를 수정하는 순수 함수에 전달된 상태의 결과물로 생각할 수 있다.

```js
const charCountState = selector({
  key: "charCountState", // 고유 아이디
  get: ({ get }) => {
    const text = get(textState);

    return text.length;
  },
});
```

**useRecoilValue() 훅을 사용해서 charCountState 값을 읽을 수 있다.**

```js
function CharacterCount() {
  const count = useRecoilValue(charCountState);

  return <>Character Count: {count}</>;
}
```

# 본격적인 Recoil 프로젝트 개발

이 섹션은 Recoil과 React가 설치했다고 가정한다. 앞으로의 섹션의 컴포넌트들은 부모트리에 `<RecoilRoot />`가 있다고 가정한다.

- todo 아이템 추가
- todo 아이템 수정
- todo 아이템 삭제
- todo 아이템 필터링
- 유용한 통계 표시

이 튜토리얼에서는 간단한 **todo 리스트 애플리케이션**을 제작한다.

**그 과정에서, 우리는 Recoil API에 의해 노출된 atoms, selectors, atom families와 hook를 다룰 것이다. 최적화 또한 다룰 것이다.**

Atoms는 애플리케이션 상태의 source of truth를 갖는다. todo 리스트에서 source of truth는 todo 아이템을 나타내는 객체로 이루어진 배열이 될 것이다.

우리는 atom 리스트를 todoListState라고 하고 이것을 atom() 함수를 이용해 생성할 것이다.

```js
const todoListState = atom({
  key: "todoListState",
  default: [],
});
```

이제 todoList코드를 작성한다.

전체 소스코드다. 자세한 설명은 주석으로 달겠다.

```js
import { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import todoListState from "./atom/todo"; //atom을 가져온다.

function App() {
  return (
    <div>
      <TodoList />
      {/*부모 컴포넌트인 TodoList를 불러온다.*/}
    </div>
  );
}

function TodoList() {
  const todoList = useRecoilValue(todoListState);
  //todoList배열을 useRecoilValue를 이용해서 가져온다.

  const mapTodoList = todoList.map((todoItem) => (
    <TodoItem key={todoItem.id} item={todoItem} />
  ));
  //가져온 todo배열을 mapping해준다.

  return (
    <>
      {/* <TodoListStats /> */}
      {/* <TodoListFilters /> */}
      <TodoItemCreator />
      <ul>{mapTodoList}</ul>
      {/* mapping한 todos를 출력한다. */}
    </>
  );
}

function TodoItemCreator() {
  const [inputValue, setInputValue] = useState("");
  //todo를 생성할때 text의 input값을 위한 state이다.
  const setTodoList = useSetRecoilState(todoListState);
  //todoList atom의 setter함수를 가져온다.

  //addItem함수는 todo를 추가하는 함수이다.
  const addItem = () => {
    setTodoList((prevTodoList) => [
      ...prevTodoList,
      {
        id: getId(),
        text: inputValue,
        isComplete: false,
      },
    ]);
    // setTodoList를 사용해서 기존 배열을 복사하고, 새로운 배열을 붙인 값을 리턴한다.
    setInputValue("");
    //input값을 리턴한다.
  };

  //onChange함수는 inputValue의 값을 변화시키는 함수이다.
  const onChange = (event) => {
    setInputValue(event.target.value);
    //event.target.value는 input값의 value를 의미한다.
  };

  return (
    <div>
      <input type="text" value={inputValue} onChange={onChange} />
      <button onClick={addItem}>Add</button>
    </div>
  );
}

function TodoItem({ item }) {
  return <li>{item.text}</li>;
  //mapping할때 필요한 컴포넌트이다.
}

//getId가 될때마다 id를 증가시킨다.
//todo객체에 id필드를 위한 함수이다.
let id = 0;
const getId = () => {
  return id++;
};

export default App;
```

![image](https://user-images.githubusercontent.com/48292190/117094181-0bd6da00-ad9e-11eb-922f-b28045fcb7e8.png)

이렇게 잘 나오면 todolist의 기본적인 기능이 적용이 된것이다.
이제 selector를 이용해서 todo들을 filter하는 작업을 해보도록 하겠다.

**Selector는 파생된 상태(derived state)의 일부를 나타낸다.**

우리가 selector로 만들 상태는 총 두개다.

- **필터링 된 todo 리스트** : 전체 todo 리스트에서 일부 기준에 따라 특정 항목이 필터링 된 새 리스트(예: 이미 완료된 항목 필터링)를 생성되어 파생된다.

- **Todo 리스트 통계** : 전체 todo 리스트에서 목록의 총 항목 수, 완료된 항목 수, 완료된 항목의 백분율 같은 리스트의 유용한 속성들을 계산하여 파생된다.

```js
const todoListFilterState = atom({
  key: "todoListFilterState",
  default: "Show All",
});
```

여기서 todoListFilterState의 값은 뭘 의미하냐면 **필터 옵션**을 의미한다.

"Show All", "Show Completed"과 "Show Uncompleted"가 있다.

이제 todoListState와 todoListFilterState 두개의 state를 가져와서 filter해보는 작업을 해보자.

```js
const filteredTodoListState = selector({
  key: "filteredTodoListState",
  get: ({ get }) => {
    const filter = get(todoListFilterState);
    const list = get(todoListState);

    switch (filter) {
      case "Show Completed":
        return list.filter((item) => item.isComplete);
      case "Show Uncompleted":
        return list.filter((item) => !item.isComplete);
      default:
        return list;
    }
  },
});
```

> 컴포넌트 관점에서 보면 selector는 atom을 읽을 때 사용하는 같은 훅을 사용해서 읽을 수 있다. 그러나 특정한 훅은 쓰기 가능 상태 (즉, useRecoilState())에서만 작동하는 점을 유의해야 한다. 모든 atom은 쓰기 가능 상태지만 selector는 일부만 쓰기 가능한 상태(get과 set 속성을 둘 다 가지고 있는 selector)로 간주된다. 이 주제에 대해서 더 많은 정보를 보고 싶다면 Core Concepts 페이지를 보면 된다.

`filteredTodoListState`는 내부적으로 2개의 의존성 `todoListFilterState`와 `todoListState`을 추적한다. 그래서 둘 중 하나라도 변하면 `filteredTodoListState`는 재 실행된다.

이제 `TodoListFilters` 컴포넌트를 만들어보자.

자세한 설명을 주석으로 설명하겠다.

```js
function TodoListFilters() {
  const [filter, setFilter] = useRecoilState(todoListFilterState);
  //todoListFilterState atom을 불러옴. state와 setter함수 get

  const updateFilter = ({ target: { value } }) => {
    setFilter(value);
  };
  //select box가 변할때마다 updateFilter함수가 실행되면서, filter state가 바뀜

  return (
    <>
      Filter:
      <select value={filter} onChange={updateFilter}>
        <option value="Show All">All</option>
        <option value="Show Completed">Completed</option>
        <option value="Show Uncompleted">Uncompleted</option>
      </select>
    </>
  );
}
```

아래는 전체 코드다.

```js
//todo.js
import { atom, selector } from "recoil";

export const todoListState = atom({
  key: "todoListState",
  default: [],
});

export const todoListFilterState = atom({
  key: "todoListFilterState",
  default: "Show All",
});

export const filteredTodoListState = selector({
  key: "filteredTodoListState",
  get: ({ get }) => {
    const filter = get(todoListFilterState);
    const list = get(todoListState);

    switch (filter) {
      case "Show Completed":
        return list.filter((item) => item.isComplete);
      case "Show Uncompleted":
        return list.filter((item) => !item.isComplete);
      default:
        return list;
    }
  },
});
```

```js
//app.js
import { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  todoListState,
  todoListFilterState,
  filteredTodoListState,
} from "./atom/todo";

function App() {
  return (
    <div>
      <TodoList />
    </div>
  );
}

function TodoList() {
  const todoList = useRecoilValue(filteredTodoListState);

  const mapTodoList = todoList.map((todoItem) => (
    <TodoItem key={todoItem.id} item={todoItem} />
  ));

  return (
    <>
      {/* <TodoListStats /> */}
      <TodoListFilters />
      <TodoItemCreator />
      <ul>{mapTodoList}</ul>
    </>
  );
}

function TodoItemCreator() {
  const [inputValue, setInputValue] = useState("");
  const setTodoList = useSetRecoilState(todoListState);

  const addItem = () => {
    setTodoList((prevTodoList) => [
      ...prevTodoList,
      {
        id: getId(),
        text: inputValue,
        isComplete: false,
      },
    ]);
    setInputValue("");
  };

  const onChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div>
      <input type="text" value={inputValue} onChange={onChange} />
      <button onClick={addItem}>Add</button>
    </div>
  );
}

function TodoListFilters() {
  const [filter, setFilter] = useRecoilState(todoListFilterState);
  //todoListFilterState atom을 불러옴. state와 setter함수 get

  const updateFilter = ({ target: { value } }) => {
    setFilter(value);
  };
  //select box가 변할때마다 updateFilter함수가 실행되면서, filter state가 바뀜

  return (
    <>
      Filter:
      <select value={filter} onChange={updateFilter}>
        <option value="Show All">All</option>
        <option value="Show Completed">Completed</option>
        <option value="Show Uncompleted">Uncompleted</option>
      </select>
    </>
  );
}

function TodoItem({ item }) {
  return <li>{item.text}</li>;
}

let id = 0;
const getId = () => {
  return id++;
};

export default App;
```

그러면 정상적으로 필터링이 잘 되는 모습을 볼 수 있다.
![image](https://user-images.githubusercontent.com/48292190/117095374-2f4f5400-ada1-11eb-92cf-b74ff4f23edb.png)

우리가 적업할 기능들은

- todo 항목들의 총개수
- 완료된 todo 항목들의 총개수
- 완료되지 않은 todo 항목들의 총개수
- 완료된 항목의 백분율

이다.

필요한 데이터를 포함하는 객체를 반환하는 selector 하나를 만드는 것이 더 쉬운 방법일것이다.

```js
const todoListStatsState = selector({
  key: "todoListStatsState",
  get: ({ get }) => {
    const todoList = get(todoListState);
    const totalNum = todoList.length;
    const totalCompletedNum = todoList.filter((item) => item.isComplete).length;
    const totalUncompletedNum = totalNum - totalCompletedNum;
    const percentCompleted = totalNum === 0 ? 0 : totalCompletedNum / totalNum;

    return {
      totalNum,
      totalCompletedNum,
      totalUncompletedNum,
      percentCompleted,
    };
  },
});
```

아래와 같은 방법으로 말이다.

```js
function TodoListStats() {
  const {
    totalNum,
    totalCompletedNum,
    totalUncompletedNum,
    percentCompleted,
  } = useRecoilValue(todoListStatsState);

  const formattedPercentCompleted = Math.round(percentCompleted * 100);

  return (
    <ul>
      <li>Total items: {totalNum}</li>
      <li>Items completed: {totalCompletedNum}</li>
      <li>Items not completed: {totalUncompletedNum}</li>
      <li>Percent completed: {formattedPercentCompleted}</li>
    </ul>
  );
}
```

TodoListStats를 하나 만들고 렌더링을 해보자.

![image](https://user-images.githubusercontent.com/48292190/117095722-14c9aa80-ada2-11eb-97c1-29b3e4e478bf.png)

만들다보니 까먹은게 있다...삭제와 수정을 안만들었다...
후딱 만들어보도록 하자

```js
function replaceItemAtIndex(arr, index, newValue) {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}

function removeItemAtIndex(arr, index) {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}
```

우선 위와같이 수정, 삭제를 위한 유틸리티 함수를 만들어주자.

replaceItemAtIndex은 수정 할 index를 인자로 받고 그 전의 배열과 index뒤에 배열을 복사한 뒤, index의 값을 끼워넣는다는 의미이다.

removeItemAtIndex은 삭제할 index를 인자로 받고 그 전의 배열을 복사,index뒤의 배열을 복사 후 index의 값을 제외하겠다는 의미이다.

이제 만들었으니까 사용해보도록 하자.

```js
import { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  todoListState,
  todoListFilterState,
  filteredTodoListState,
  todoListStatsState,
} from "./atom/todo";

function App() {
  return (
    <div>
      <TodoList />
    </div>
  );
}

function TodoList() {
  const todoList = useRecoilValue(filteredTodoListState);

  const mapTodoList = todoList.map((todoItem) => (
    <TodoItem key={todoItem.id} item={todoItem} />
  ));

  return (
    <>
      <TodoListStats />
      <TodoListFilters />
      <TodoItemCreator />
      <ul>{mapTodoList}</ul>
    </>
  );
}

function TodoItemCreator() {
  const [inputValue, setInputValue] = useState("");
  const setTodoList = useSetRecoilState(todoListState);

  const addItem = () => {
    setTodoList((prevTodoList) => [
      ...prevTodoList,
      {
        id: getId(),
        text: inputValue,
        isComplete: false,
      },
    ]);
    setInputValue("");
  };

  const onChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div>
      <input type="text" value={inputValue} onChange={onChange} />
      <button onClick={addItem}>Add</button>
    </div>
  );
}

function TodoListFilters() {
  const [filter, setFilter] = useRecoilState(todoListFilterState);
  //todoListFilterState atom을 불러옴. state와 setter함수 get

  const updateFilter = ({ target: { value } }) => {
    setFilter(value);
  };
  //select box가 변할때마다 updateFilter함수가 실행되면서, filter state가 바뀜

  return (
    <>
      Filter:
      <select value={filter} onChange={updateFilter}>
        <option value="Show All">All</option>
        <option value="Show Completed">Completed</option>
        <option value="Show Uncompleted">Uncompleted</option>
      </select>
    </>
  );
}

function TodoListStats() {
  const {
    totalNum,
    totalCompletedNum,
    totalUncompletedNum,
    percentCompleted,
  } = useRecoilValue(todoListStatsState);

  const formattedPercentCompleted = Math.round(percentCompleted * 100);

  return (
    <ul>
      <li>Total items: {totalNum}</li>
      <li>Items completed: {totalCompletedNum}</li>
      <li>Items not completed: {totalUncompletedNum}</li>
      <li>Percent completed: {formattedPercentCompleted}</li>
    </ul>
  );
}

function TodoItem({ item }) {
  const [toggleEdit, setToggleEdit] = useState(false);
  const [todoList, setTodoList] = useRecoilState(todoListState);
  const index = todoList.findIndex((listItem) => listItem === item);

  const editItemText = (event) => {
    const { value } = event.target;
    const newList = replaceItemAtIndex(todoList, index, {
      ...item,
      text: value,
    });

    setTodoList(newList);
  };

  const onEdit = () => {
    setToggleEdit(!toggleEdit);
  };

  const toggleItemCompletion = () => {
    const newList = replaceItemAtIndex(todoList, index, {
      ...item,
      isComplete: !item.isComplete,
    });

    setTodoList(newList);
  };

  const deleteItem = () => {
    const newList = removeItemAtIndex(todoList, index);

    setTodoList(newList);
  };

  return (
    <li>
      {toggleEdit && (
        <input type="text" value={item.text} onChange={editItemText} />
      )}
      {item.text}
      <input
        type="checkbox"
        checked={item.isComplete}
        onChange={toggleItemCompletion}
      />
      <button onClick={deleteItem}>X</button>
      <button onClick={onEdit}> {toggleEdit ? "완료" : "수정"} </button>
    </li>
  );
}

function replaceItemAtIndex(arr, index, newValue) {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}

function removeItemAtIndex(arr, index) {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

let id = 0;
const getId = () => {
  return id++;
};

export default App;
```

![image](https://user-images.githubusercontent.com/48292190/117099971-7fccae80-adad-11eb-9eb8-f149060b53e3.png)


# 🎊 축하합니다! 🎊

투두리스트 개념을 완벽히 이해했다면, 당신은 atom , selector를 마스터했습니다!
이제 비동기 데이터 쿼리로 넘어가보도록 하겠습니다.

# 비동기 데이터 쿼리

