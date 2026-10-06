"use client";
import { useEffect, useState } from "react";
import type { HouseVariant } from "@/lib/houseSprites";

// Loops the six idle frames of a house sheet. Sizing uses container query units
// (cqw) so the house scales with the width the parent gives it.
export default function HouseSprite({
  variant,
  frameMs = 200,
  className,
}: {
  variant: HouseVariant;
  frameMs?: number;
  className?: string;
}) {
  const [step, setStep] = useState(0);
  const count = variant.frames.length;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setStep((s) => (s + 1) % count), frameMs);
    return () => clearInterval(id);
  }, [count, frameMs]);

  const f = variant.frames[step];
  const boxW = variant.frames[0].w;
  const boxH = variant.frames[0].h;
  const u = 100 / boxW; // cqw per sprite pixel

  return (
    <div
      className={`relative ${className ?? ""}`}
      style={{ containerType: "inline-size", aspectRatio: `${boxW} / ${boxH}` }}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${variant.src})`,
          backgroundSize: `${variant.sheet.width * u}cqw ${variant.sheet.height * u}cqw`,
          backgroundPosition: `${-f.x * u}cqw ${-f.y * u}cqw`,
          backgroundRepeat: "no-repeat",
        }}
      />
    </div>
  );
}
