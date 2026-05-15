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

export default function Timer({ Hz, running, reset }) {
  const expected = Temporal.Duration.from({ microseconds: Math.trunc(1000_000 / Hz) });
  const [startTime, setStartTime] = useState(undefined);
  const [endTime, setEndTime] = useState(undefined);
  const [totalDuration, setTotalDuration] = useState(new Temporal.Duration());
  const [pausedDuration, setPausedDuration] = useState(new Temporal.Duration());

  const intervalRef = useRef(-1);
  const start = () => {
    const initial = Temporal.Now.instant();
    setEndTime(initial);
    if (!startTime) {
      setStartTime(initial);
    }
    if (endTime) {
      setPausedDuration((paused) => paused.add(initial.since(endTime)));
    }

    intervalRef.current = setInterval(() => {
      const instant = Temporal.Now.instant();
      setEndTime(instant);
    }, 1000 / Hz);
  }

  const stop = () => {
    setEndTime(Temporal.Now.instant());
    clearInterval(intervalRef.current);
    intervalRef.current = -1;
  };

  const onReset = () => {
    setStartTime(!running ? undefined : Temporal.Now.instant());
    setEndTime(undefined);
    setTotalDuration(new Temporal.Duration());
    setPausedDuration(new Temporal.Duration());
  };

  useEffect(() => {
    running ? start() : stop();
    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = -1;
    };
  }, [running]);

  useEffect(() => onReset(), [reset]);
  useEffect(() => {
    setTotalDuration(
      endTime?.since(startTime ?? endTime, {
        largestUnit: 'hours',
        smallestUnit: 'millisecond',
      }) ?? new Temporal.Duration()
    );
  }, [endTime, startTime]);



  return (
    <div>
      <big>{format(totalDuration.subtract(pausedDuration))}</big>
      <small>@ {Hz} Hz (every {expected.total('millisecond')}ms)</small>
    </div>
  );
}
