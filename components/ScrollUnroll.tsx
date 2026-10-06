"use client";
import { useEffect, useState } from "react";
import {
  SCROLL_SHEET_HEIGHT,
  SCROLL_SHEET_URL,
  SCROLL_SHEET_WIDTH,
  type SpriteRect,
} from "@/lib/spriteSheet";

// Plays the frames once, then holds the last frame. Sizing uses container
// query units (cqw) so the scroll scales with whatever width the parent gives it.
export default function ScrollUnroll({
  frames,
  frameMs,
  onComplete,
  className,
}: {
  frames: SpriteRect[];
  frameMs: number;
  onComplete?: () => void;
  className?: string;
}) {
  const last = frames.length - 1;
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(last);
      return;
    }
    const id = setInterval(
      () => setStep((s) => Math.min(s + 1, last)),
      frameMs
    );
    return () => clearInterval(id);
  }, [last, frameMs]);

  useEffect(() => {
    if (step === last) onComplete?.();
  }, [step, last, onComplete]);

  // One shared box for all frames, so the scroll stays in the same place as it unrolls
  const boxW = Math.max(...frames.map((f) => f.w));
  const boxH = Math.max(...frames.map((f) => f.h));
  const u = 100 / boxW; // cqw per sprite pixel

  const f = frames[step];

  return (
    <div
      className={`relative ${className ?? ""}`}
      style={{ containerType: "inline-size", aspectRatio: `${boxW} / ${boxH}` }}
    >
      <div
        style={{
          position: "absolute",
          left: `${((boxW - f.w) / 2) * u}cqw`,
          top: `${((boxH - f.h) / 2) * u}cqw`,
          width: `${f.w * u}cqw`,
          height: `${f.h * u}cqw`,
          backgroundImage: `url(${SCROLL_SHEET_URL})`,
          backgroundSize: `${SCROLL_SHEET_WIDTH * u}cqw ${SCROLL_SHEET_HEIGHT * u}cqw`,
          backgroundPosition: `${-f.x * u}cqw ${-f.y * u}cqw`,
          backgroundRepeat: "no-repeat",
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
