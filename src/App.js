import { useState, useEffect } from 'react';
import React from 'react';
import './style.css';

export default function App() {
  const [startTime, setStartTime] = useState(undefined);
  const [endTime, setEndTime] = useState(undefined);
  const [totalDuration, setTotalDuration] = useState(new Temporal.Duration());
  const [pausedDuration, setPausedDuration] = useState(new Temporal.Duration());
  const [intervalId, setIntervalId] = useState(-1);

  const formatter = new Intl.DurationFormat('en-NZ', {
    style: 'digital',
    hoursDisplay: 'auto',
    secondsDisplay: 'always',
    minutesDisplay: 'always',
  });

  const start = () => {
    const now = Temporal.Now.instant();
    if (!startTime) {
      setStartTime(now);
    }
    if (endTime) {
      setPausedDuration((paused) => paused.add(now.since(endTime)));
    }
    setIntervalId(setInterval(() => setEndTime(Temporal.Now.instant())));
  };

  const stop = () => {
    setEndTime(Temporal.Now.instant());
    clearInterval(intervalId);
    setIntervalId(-1);
  };

  const reset = () => {
    setStartTime(intervalId === -1 ? undefined : Temporal.Now.instant());
    setEndTime(undefined);
    setTotalDuration(new Temporal.Duration());
    setPausedDuration(new Temporal.Duration());
  };

  useEffect(() => {
    setTotalDuration(
      endTime?.since(startTime ?? endTime, {
        smallestUnit: 'microseconds',
      }) ?? new Temporal.Duration()
    );
  }, [endTime, startTime]);

  return (
    <div>
      <h1>{formatter.format(totalDuration.subtract(pausedDuration))}</h1>
      {intervalId === -1 ? (
        <button onClick={start}>start</button>
      ) : (
        <button onClick={stop}>stop</button>
      )}
      <button onClick={reset}>reset</button>
      <pre>
        <div>
          start time:{' '}
          {startTime && startTime !== endTime ? startTime.toString() : '-'}
        </div>
        <div>
          end time:{' '}
          {endTime && startTime !== endTime ? endTime.toString() : '-'}
        </div>
        <div>+++ elapsed: {formatter.format(totalDuration)}</div>
        <div>-- paused: {formatter.format(pausedDuration)}</div>
        <div>
          = timed: {formatter.format(totalDuration.subtract(pausedDuration))}
        </div>
      </pre>
    </div>
  );
}
