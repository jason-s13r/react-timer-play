import { useState, useRef, useEffect } from 'react';

const format = duration => {
  return new Intl.DurationFormat('en-NZ', {
    style: 'digital',
    hoursDisplay: 'auto',
    minutesDisplay: 'always',
    secondsDisplay: 'always',
    minutesDisplay: 'always',
  }).format(duration.round({ largestUnit: 'hours', smallestUnit: 'milliseconds' }));
}

export default function Counter({ Hz, running, reset }) {
  const expected = Temporal.Duration.from({ microseconds: Math.trunc(1000_000 / Hz) });
  const [duration, setDuration] = useState(new Temporal.Duration());
  const intervalRef = useRef(-1);

  const start = () => {
    intervalRef.current = setInterval(() => 
      setDuration(d => d.add(expected))
    , 1000 / Hz);
  }

  const stop = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = -1;
  };

  const onReset = () => {
    setDuration(new Temporal.Duration());
  };

  useEffect(() => {
    running ? start() : stop();
    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = -1;
    };
  }, [running]);

  useEffect(() => onReset(), [reset]);

  return (
    <div>
      <big>{format(duration)}</big>
      <small>@ {Hz} Hz (every {expected.total('millisecond')}ms)</small>
    </div>
  );
}
