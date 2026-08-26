import { useEffect, useRef, useState } from 'react';

interface UseScrollRevealOptions {
  threshold?: number;
  once?: boolean;
  rootMargin?: string;
}

/**
 * Returns a ref and a boolean `isVisible`.
 * Once the element enters the viewport, `isVisible` becomes true.
 * If `once` is true (default), stays true forever after first reveal.
 */
export function useScrollReveal<T extends Element = HTMLDivElement>({
  threshold = 0.15,
  once = true,
  rootMargin = '0px 0px -40px 0px',
}: UseScrollRevealOptions = {}) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once, rootMargin]);

  return { ref, isVisible };
}
