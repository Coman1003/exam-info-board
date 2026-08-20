import { useEffect, useMemo, useState } from 'react';

const pad = (value: number) => String(value).padStart(2, '0');

const toDateTimeString = (date: Date) => {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const toTimeString = (date: Date) => `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

export function useClock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  return useMemo(
    () => ({
      currentTime,
      dateTimeText: toDateTimeString(currentTime),
      timeText: toTimeString(currentTime)
    }),
    [currentTime]
  );
}
