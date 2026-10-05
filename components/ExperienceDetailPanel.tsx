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
      className="absolute top-1/2 right-[3%] hidden lg:block"
      style={{
        width: "min(860px, 85vw, 90vh)",
        aspectRatio: "1 / 1",
        backgroundImage: "url(/imagesv2/others/scroll-panel.png)",
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        imageRendering: "pixelated",
        transform: "translate(100%, -50%)",
        opacity: 0,
      }}
    >
      <div
        className="absolute text-[#3b2412]"
        style={{
          top: "30%",
          bottom: "29%",
          left: "34%",
          right: "28%",
          padding: "2%",
        }}
      >
        <h4
          className={`${pixelTitle.className} text-[#5a2d0c] text-[11px] sm:text-xs leading-relaxed mb-3`}
        >
          {experience.name}
        </h4>
        {experience.description ? (
          <p
            className={`${pixelBody.className} text-xl sm:text-2xl leading-tight mb-3`}
          >
            {experience.description}
          </p>
        ) : (
          <p
            className={`${pixelBody.className} text-xl sm:text-2xl leading-tight mb-3 opacity-80`}
          >
            {experience.additional} · {experience.year}
          </p>
        )}
        {hasReference && (
          <div className={`${pixelBody.className} border-t border-[#3b2412]/40 pt-2`}>
            <p className="text-base uppercase opacity-70">Reference</p>
            {experience.reference_name && (
              <p className="text-lg font-bold">{experience.reference_name}</p>
            )}
            {experience.reference_title && (
              <p className="text-base">{experience.reference_title}</p>
            )}
            {experience.reference_contact && (
              <p className="text-base">{experience.reference_contact}</p>
            )}
            {experience.reference_link && (
              <a
                href={experience.reference_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base underline text-[#7a3b00]"
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
