import { useState, useEffect, RefObject } from "react";

export const useScrollProgress = (elementRef: RefObject<HTMLElement | null>) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!elementRef.current) return;
      const height = elementRef.current.scrollHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(window.scrollY - (elementRef.current.offsetTop - 80), 0), height || 1);
      const pct = height > 0 ? Math.floor((scrolled / height) * 100) : 0;
      setProgress(pct);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [elementRef]);

  return progress;
};