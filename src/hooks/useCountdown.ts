import { useState, useEffect } from 'react';

interface CountdownResult {
  formatted: string;
  isUrgent: boolean; // less than 6 hours
  isEnded: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function useCountdown(targetTimestamp: number): CountdownResult {
  const [timeLeft, setTimeLeft] = useState<number>(() => Math.max(0, targetTimestamp - Date.now()));

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(0, targetTimestamp - Date.now());
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTimestamp]);

  const isEnded = timeLeft <= 0;
  const isUrgent = timeLeft < 6 * 3600 * 1000 && !isEnded;

  const totalSeconds = Math.floor(timeLeft / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let formatted = '';
  if (isEnded) {
    formatted = 'Subasta Finalizada';
  } else if (days > 0) {
    formatted = `${days}d ${hours}h ${minutes}m`;
  } else {
    formatted = `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
  }

  return {
    formatted,
    isUrgent,
    isEnded,
    days,
    hours,
    minutes,
    seconds,
  };
}
