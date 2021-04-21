import React from 'react';
import "./CounterButton.css";

const CounterButton = React.memo(({text , handleClick}) => {
    return <button onClick={handleClick} className="CounterButton">{text}</button>;
});

export default CounterButton;