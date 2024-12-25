import { useRef, useCallback } from "react";

const useDebounce = (callback: any, delay: number) => {
    const timer = useRef<NodeJS.Timeout | null>(null);

    const debouncedCallback = useCallback(
        (...args: any[]) => {
            if (timer.current) {
                clearTimeout(timer.current);
            }
            timer.current = setTimeout(() => {
                callback(...args);
            }, delay);
        },
        [callback, delay]
    );

    return debouncedCallback;
};

export default useDebounce;
