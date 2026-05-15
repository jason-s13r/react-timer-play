import { useState, useRef, useEffect } from 'react';
import React from 'react';
import './style.css';
import Timer from './Timer.js';
import Counter from './Counter.js';

export default function App() {
  const [running, setRunning] = useState(false);
  const [reset, setReset] = useState(0);

  const onStart = () => setRunning(true);
  const onStop = () => setRunning(false);
  const onReset = () => setReset(r => r + 1);

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <h1>Timers:</h1>
          <Timer Hz={1000} running={running} reset={reset} />
          <Timer Hz={100} running={running} reset={reset} />
          <Timer Hz={50} running={running} reset={reset} />
          <Timer Hz={24} running={running} reset={reset} />
          <Timer Hz={20} running={running} reset={reset} />
          <Timer Hz={12} running={running} reset={reset} />
          <Timer Hz={10} running={running} reset={reset} />
          <Timer Hz={4} running={running} reset={reset} />
          <Timer Hz={2} running={running} reset={reset} />
          <Timer Hz={1} running={running} reset={reset} />
        </div>
        <div>
          <h1>Counters:</h1>
          <Counter Hz={1000} running={running} reset={reset} />
          <Counter Hz={100} running={running} reset={reset} />
          <Counter Hz={50} running={running} reset={reset} />
          <Counter Hz={24} running={running} reset={reset} />
          <Counter Hz={20} running={running} reset={reset} />
          <Counter Hz={12} running={running} reset={reset} />
          <Counter Hz={10} running={running} reset={reset} />
          <Counter Hz={4} running={running} reset={reset} />
          <Counter Hz={2} running={running} reset={reset} />
          <Counter Hz={1} running={running} reset={reset} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {running ?
          <button onClick={onStop}>stop</button> :
          <button onClick={onStart}>start</button>}
        <button onClick={onReset}>reset</button>
      </div>
    </>
  );
}
