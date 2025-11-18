"use client";
import { useEffect, useState, useRef, ReactNode } from "react";

interface LazyCanvasProps {
  children: ReactNode;
  threshold?: number;
  rootMargin?: string;
}

export default function LazyCanvas({
  children,
  threshold = 0.1,
  rootMargin = "100px",
}: LazyCanvasProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
          if (entry.isIntersecting) {
            setHasBeenVisible(true);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [threshold, rootMargin]);

  return (
    <div ref={containerRef} className="w-full h-full">
      {hasBeenVisible && children}
    </div>
  );
}
