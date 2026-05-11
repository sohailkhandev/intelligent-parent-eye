import { useCallback, useRef } from "react";

interface UseTimeoutReturn {
  reset: () => void;
  clear: () => void;
}

export default function useTimeout(
  callback: () => void,
  delay: number
): UseTimeoutReturn {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);

  callbackRef.current = callback;

  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callbackRef.current();
    }, delay);
  }, [delay]);

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return { reset, clear };
}
