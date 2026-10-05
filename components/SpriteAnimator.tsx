"use client";
import { useEffect, useState } from "react";

const SHEET_URL = "/imagesv2/others/z-character.png";
const COLS = 5;
const ROWS = 6;

// Frames are row-major indexes into the 5 x 6 spritesheet.
export default function SpriteAnimator({
  frames,
  frameMs,
  cellWidth,
  cellHeight,
  className,
}: {
  frames: number[];
  frameMs: number;
  cellWidth: number;
  cellHeight: number;
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

  const frame = frames[step];
  const col = frame % COLS;
  const row = Math.floor(frame / COLS);

  return (
    <div
      className={className}
      style={{
        width: cellWidth,
        height: cellHeight,
        backgroundImage: `url(${SHEET_URL})`,
        backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
        backgroundPosition: `${(col / (COLS - 1)) * 100}% ${(row / (ROWS - 1)) * 100}%`,
        backgroundRepeat: "no-repeat",
        imageRendering: "pixelated",
      }}
    />
  );
}
