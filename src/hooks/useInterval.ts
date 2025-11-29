import { useEffect, useRef } from 'react';

const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<() => void>(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => savedCallback.current();

    let id: ReturnType<typeof setInterval>;

    if (delay !== null) {
      id = setInterval(tick, delay);
    }

    return () => {
      if (id) {
        clearInterval(id);
      }
    };
  }, [delay]);

  return null;
};

export default useInterval;
