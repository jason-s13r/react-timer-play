import { useState, useRef, useEffect } from 'react';
import React from 'react';
import './style.css';

const format = duration => {
  return new Intl.DurationFormat('en-NZ', {
    style: 'digital',
    hoursDisplay: 'auto',
    minutesDisplay: 'always',
    secondsDisplay: 'always',
    minutesDisplay: 'always',
  }).format(duration.round({ largestUnit: 'hours', smallestUnit: 'milliseconds' }));
}

function Timer({ Hz, running, reset }) {
  const [startTime, setStartTime] = useState(undefined);
  const [endTime, setEndTime] = useState(undefined);
  const [totalDuration, setTotalDuration] = useState(new Temporal.Duration());
  const [pausedDuration, setPausedDuration] = useState(new Temporal.Duration());
  const [intervalId, setIntervalId] = useState(-1);

  const start = () => {
    const now = Temporal.Now.instant();
    setEndTime(now);
    if (!startTime) {
      setStartTime(now);
    }
    if (endTime) {
      setPausedDuration((paused) => paused.add(now.since(endTime)));
    }

    setIntervalId(setInterval(() => setEndTime(Temporal.Now.instant()), 1000 / Hz));
  }

  const stop = () => {
    const now = Temporal.Now.instant();
    setEndTime(now);
    clearInterval(intervalId);
    setIntervalId(-1);
  };

  const onReset = () => {
    setStartTime(!running ? undefined : Temporal.Now.instant());
    setEndTime(undefined);
    setTotalDuration(new Temporal.Duration());
    setPausedDuration(new Temporal.Duration());
  };

  useEffect(() => running ? start() : stop(), [running]);
  useEffect(() => onReset(), [reset]);
  useEffect(() => {
    setTotalDuration(
      endTime?.since(startTime ?? endTime, {
        largestUnit: 'hours',
        smallestUnit: 'microseconds',
      }) ?? new Temporal.Duration()
    );
  }, [endTime, startTime]);


  return (
    <div>
      <big>{format(totalDuration.subtract(pausedDuration))}</big>
      <small>@ {Hz} Hz</small>
      <pre>
        <div>
          start time:{' '}
          {startTime ? startTime.toString() : '-'}
        </div>
        <div>
          end time:{' '}
          {endTime && startTime !== endTime ? endTime.toString() : '-'}
        </div>
        <div>+++ elapsed: {format(totalDuration)}</div>
        <div>-- paused: {format(pausedDuration)}</div>
        <div>
          = timed: {format(totalDuration.subtract(pausedDuration))}
        </div>
      </pre>
    </div>
  );
}


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
      <Timer Hz={1} running={running} reset={reset} />
      <Timer Hz={2} running={running} reset={reset} />
      {running ?
        <button onClick={onStop}>stop</button> :
        <button onClick={onStart}>start</button>}
      <button onClick={onReset}>reset</button>
    </div>
  );
}
