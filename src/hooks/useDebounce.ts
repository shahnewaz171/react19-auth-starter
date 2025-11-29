import { useEffect, useRef } from 'react';

const useDebounce = <T extends (...args: any[]) => void>(callback: T, delay: number) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () =>
      // Cleanup the previous timeout on re-render
      () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      },
    []
  );

  const debouncedCallback = (...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  return debouncedCallback;
};

export default useDebounce;
