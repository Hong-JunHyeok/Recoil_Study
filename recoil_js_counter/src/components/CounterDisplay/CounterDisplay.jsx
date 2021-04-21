import React from "react";
import "./CounterDisplay.css";

const CounterDisplay = React.memo(({ number }) => {
  return (
    <div className="CounterDisplay">
      <span>{number - 1}</span>
      <h1>{number}</h1>
      <span>{number + 1}</span>
    </div>
  );
});

export default CounterDisplay;
