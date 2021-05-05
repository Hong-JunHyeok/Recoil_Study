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
