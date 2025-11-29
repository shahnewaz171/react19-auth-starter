import { useState, useEffect, useRef } from 'react';

export const useOtpTimer = (initialDuration: number = 0) => {
  const [timeLeft, setTimeLeft] = useState<number>(initialDuration);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const workerUrl = `${window.location.origin}/otpTimerWorker.js`;
    workerRef.current = new Worker(workerUrl);

    workerRef.current.onmessage = (event: MessageEvent) => {
      const { type, timeLeft: time_left } = event.data;

      if (type === 'tick') {
        setTimeLeft(time_left);
        setIsExpired(false);
      } else if (type === 'expired') {
        setIsExpired(true);
        setTimeLeft(0);
      }
    };

    return () => {
      workerRef.current?.postMessage({ action: 'stop' });
      workerRef.current?.terminate();
    };
  }, []);

  const start = (duration: number) => {
    setIsExpired(false);
    setTimeLeft(duration);
    workerRef.current?.postMessage({ action: 'start', duration });
  };

  const stop = () => {
    workerRef.current?.postMessage({ action: 'stop' });
  };

  return {
    timeLeft,
    isExpired,
    start,
    stop
  };
};
