"use client";
import { useCallback, useState } from "react";
import type { ExperienceRecord } from "@/lib/types";
import { pixelBody, pixelTitle } from "@/lib/fonts";
import ScrollUnroll from "@/components/ScrollUnroll";
import { SCROLL_UNROLL_FRAMES } from "@/lib/spriteSheet";

export default function ExperienceDetailPanel({
  experience,
}: {
  experience: ExperienceRecord;
}) {
  // Text shows once the scroll has finished unrolling for this experience
  const [unrolledId, setUnrolledId] = useState<string | null>(null);
  const handleUnrolled = useCallback(
    () => setUnrolledId(experience.id),
    [experience.id]
  );
  const isOpen = unrolledId === experience.id;

  const hasReference = Boolean(
    experience.reference_name ||
      experience.reference_title ||
      experience.reference_contact ||
      experience.reference_link
  );

  return (
    <div
      id="experience-detail-panel"
      className="absolute top-1/2 right-[12%] -translate-y-1/2 w-[94vw] lg:w-[min(560px,85vw,calc(90vh*0.863))]"
      style={{ opacity: 0 }}
    >
      {/* Remounts for each experience so the unroll plays again */}
      <ScrollUnroll
        key={experience.id}
        frames={SCROLL_UNROLL_FRAMES}
        frameMs={80}
        onComplete={handleUnrolled}
        className="w-full"
      />

      <div
        className={`absolute top-[25%] bottom-[24%] left-[24%] right-[24%] overflow-y-auto text-[#3b2412] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      >
        <h4
          className={`${pixelTitle.className} text-[9px] sm:text-[11px] text-[#5a2d0c] leading-relaxed mb-2`}
        >
          {experience.name}
        </h4>
        {experience.description ? (
          <p
            className={`${pixelBody.className} text-lg sm:text-xl leading-tight mb-2`}
          >
            {experience.description}
          </p>
        ) : (
          <p
            className={`${pixelBody.className} text-lg sm:text-xl leading-tight mb-2 opacity-80`}
          >
            {experience.additional} · {experience.year}
          </p>
        )}
        {hasReference && (
          <div
            className={`${pixelBody.className} border-t border-[#3b2412]/40 pt-1`}
          >
            <p className="text-sm sm:text-base uppercase opacity-70">Reference</p>
            {experience.reference_name && (
              <p className="text-base sm:text-lg font-bold">
                {experience.reference_name}
              </p>
            )}
            {experience.reference_title && (
              <p className="text-sm sm:text-base">{experience.reference_title}</p>
            )}
            {experience.reference_contact && (
              <p className="text-sm sm:text-base">{experience.reference_contact}</p>
            )}
            {experience.reference_link && (
              <a
                href={experience.reference_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm sm:text-base underline text-[#7a3b00]"
              >
                View Profile
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
