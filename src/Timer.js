import { useState, useEffect } from 'react';

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
        <div>{'+ elapsed:'} {format(totalDuration)}</div>
        <div>{'-  paused:'} {format(pausedDuration)}</div>
        <div>
          {'=   timed:'} {format(totalDuration.subtract(pausedDuration))}
        </div>
      </pre>
    </div>
  );
}
