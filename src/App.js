import { useState, useRef, useEffect } from 'react';
import React from 'react';
import './style.css';
import Timer from './Timer.js';

export default function App() {
  const [running, setRunning] = useState(false);
  const [reset, setReset] = useState(0);

  const onStart = () => setRunning(true);
  const onStop = () => setRunning(false);
  const onReset = () => setReset(r => r + 1);

  return (
    <div>
      <Timer Hz={12} running={running} reset={reset} />
      <Timer Hz={24} running={running} reset={reset} />
      <Timer Hz={2} running={running} reset={reset} />
      <Timer Hz={1} running={running} reset={reset} />
      {running ?
        <button onClick={onStop}>stop</button> :
        <button onClick={onStart}>start</button>}
      <button onClick={onReset}>reset</button>
    </div>
  );
}
