"use client";
import { useEffect, useState, type ReactNode } from "react";
import { CERT_FRAME_SHEET, type CertFrameVariant } from "@/lib/certFrames";

// Loops the 4 shimmer frames of a frame sheet around its children, which sit in
// the transparent opening. Sizing uses container query units (cqw) so the frame
// scales with the card.
export default function CertificateFrame({
  variant,
  frameMs = 200,
  className,
  children,
}: {
  variant: CertFrameVariant;
  frameMs?: number;
  className?: string;
  children: ReactNode;
}) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setStep((s) => (s + 1) % 4), frameMs);
    return () => clearInterval(id);
  }, [frameMs]);

  const { box, inner, src } = variant;
  const u = 100 / box.w; // cqw per sprite pixel
  const cellX = (step % 2) * (CERT_FRAME_SHEET.width / 2);
  const cellY = Math.floor(step / 2) * (CERT_FRAME_SHEET.height / 2);

  return (
    <div
      className={`relative ${className ?? ""}`}
      style={{ containerType: "inline-size", aspectRatio: `${box.w} / ${box.h}` }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${src})`,
          backgroundSize: `${CERT_FRAME_SHEET.width * u}cqw ${CERT_FRAME_SHEET.height * u}cqw`,
          backgroundPosition: `${-(cellX + box.x) * u}cqw ${-(cellY + box.y) * u}cqw`,
          backgroundRepeat: "no-repeat",
        }}
      />
      <div
        className="absolute"
        style={{
          left: `${(inner.l / box.w) * 100}%`,
          top: `${(inner.t / box.h) * 100}%`,
          width: `${((inner.r - inner.l + 1) / box.w) * 100}%`,
          height: `${((inner.b - inner.t + 1) / box.h) * 100}%`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
