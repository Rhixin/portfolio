"use client";
import { useEffect, useMemo, useState } from "react";
import {
  SHEET_HEIGHT,
  SHEET_URL,
  SHEET_WIDTH,
  type SpriteRect,
} from "@/lib/spriteSheet";

export default function SpriteAnimator({
  frames,
  frameMs,
  boxWidth,
  boxHeight,
  className,
}: {
  frames: SpriteRect[];
  frameMs: number;
  boxWidth: number;
  boxHeight: number;
  className?: string;
}) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(
      () => setStep((s) => (s + 1) % frames.length),
      frameMs
    );
    return () => clearInterval(id);
  }, [frames.length, frameMs]);

  // One shared scale for the whole set so the character keeps the same size between frames
  const scale = useMemo(() => {
    const maxW = Math.max(...frames.map((f) => f.w));
    const maxH = Math.max(...frames.map((f) => f.h));
    return Math.min(boxWidth / maxW, boxHeight / maxH);
  }, [frames, boxWidth, boxHeight]);

  const f = frames[step];
  const drawW = f.w * scale;
  const drawH = f.h * scale;

  return (
    <div
      className={`flex items-end justify-center overflow-hidden ${className ?? ""}`}
      style={{ width: boxWidth, height: boxHeight }}
    >
      {/* The inner box is exactly the sprite's own pixels, so neighbouring sprites never show */}
      <div
        style={{
          width: drawW,
          height: drawH,
          backgroundImage: `url(${SHEET_URL})`,
          backgroundSize: `${SHEET_WIDTH * scale}px ${SHEET_HEIGHT * scale}px`,
          backgroundPosition: `${-f.x * scale}px ${-f.y * scale}px`,
          backgroundRepeat: "no-repeat",
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
