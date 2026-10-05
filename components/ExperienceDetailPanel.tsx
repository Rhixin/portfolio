"use client";
import type { ExperienceRecord } from "@/lib/types";
import { pixelBody, pixelTitle } from "@/lib/fonts";

export default function ExperienceDetailPanel({
  experience,
}: {
  experience: ExperienceRecord;
}) {
  const hasReference = Boolean(
    experience.reference_name ||
      experience.reference_title ||
      experience.reference_contact ||
      experience.reference_link
  );

  return (
    <div
      id="experience-detail-panel"
      className="absolute top-1/2 right-[3%] w-[94vw] aspect-[1/1.1] lg:w-[min(860px,85vw,90vh)] lg:aspect-square"
      style={{
        backgroundImage: "url(/imagesv2/others/scroll-panel.png)",
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        imageRendering: "pixelated",
        transform: "translate(100%, -50%)",
        opacity: 0,
      }}
    >
      <div className="absolute top-[27%] bottom-[32%] left-[31%] right-[27%] lg:left-[34%] lg:right-[28%] p-[2%] text-[#3b2412]">
        <h4
          className={`${pixelTitle.className} text-[9px] sm:text-[11px] text-[#5a2d0c] leading-relaxed mb-2`}
        >
          {experience.name}
        </h4>
        {experience.description ? (
          <p
            className={`${pixelBody.className} text-lg sm:text-xl lg:text-2xl leading-tight mb-2`}
          >
            {experience.description}
          </p>
        ) : (
          <p
            className={`${pixelBody.className} text-lg sm:text-xl lg:text-2xl leading-tight mb-2 opacity-80`}
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
