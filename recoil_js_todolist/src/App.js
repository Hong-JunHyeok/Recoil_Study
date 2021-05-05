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
