"use client";
import type { ExperienceRecord } from "@/lib/types";

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
      className="absolute top-1/2 right-8 lg:right-16 w-[85%] max-w-sm bg-[#0d0d14]/95 border border-[#FF6B35]/30 rounded-2xl p-6 backdrop-blur-sm shadow-2xl hidden lg:block"
      style={{
        transform: "translate(100%, -50%)",
        opacity: 0,
      }}
    >
      <h4 className="text-[#FF8C5A] text-sm font-bold uppercase tracking-wider mb-2">
        {experience.name}
      </h4>
      {experience.description ? (
        <p className="text-gray-300 text-sm leading-relaxed mb-4">
          {experience.description}
        </p>
      ) : (
        <p className="text-gray-500 text-sm italic mb-4">
          {experience.additional} · {experience.year}
        </p>
      )}
      {hasReference && (
        <div className="border-t border-white/10 pt-3 mt-3">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
            Reference
          </p>
          {experience.reference_name && (
            <p className="text-white text-sm font-semibold">
              {experience.reference_name}
            </p>
          )}
          {experience.reference_title && (
            <p className="text-gray-400 text-xs">{experience.reference_title}</p>
          )}
          {experience.reference_contact && (
            <p className="text-gray-400 text-xs mt-1">
              {experience.reference_contact}
            </p>
          )}
          {experience.reference_link && (
            <a
              href={experience.reference_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 text-xs hover:underline mt-1 inline-block"
            >
              View Profile
            </a>
          )}
        </div>
      )}
    </div>
  );
}
