import React from "react";
import { useCounter } from "../recoil/counter";
import "./App.css";
import CounterButton from "./CounterButton";
import CounterDisplay from "./CounterDisplay";
import CounterTemplate from "./CounterTemplate";

function App() {
  const [counter, setCounter] = useCounter();
  return (
    <>
      <CounterTemplate>
        <CounterDisplay number={counter} />
        <div>
          <CounterButton
            text="+"
            handleClick={() => setCounter((prev) => prev + 1)}
          />
          <CounterButton
            text="-"
            handleClick={() => setCounter((prev) => prev - 1)}
          />
        </div>
        <span>Powered by React & Recoil</span>
      </CounterTemplate>
    </>
  );
}

export default App;
