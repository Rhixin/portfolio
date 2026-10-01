"use client";
import { use, useEffect, useState } from "react";
import ExperienceForm from "@/components/admin/ExperienceForm";
import type { ExperienceRecord } from "@/lib/types";

export default function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [entry, setEntry] = useState<ExperienceRecord | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch("/api/experience")
      .then((r) => r.json())
      .then((json) => {
        const found = (json.experience as ExperienceRecord[]).find((e) => e.id === id);
        if (!found) {
          setNotFound(true);
          return;
        }
        setEntry(found);
      });
  }, [id]);

  if (notFound) return <p className="text-gray-400">Experience entry not found.</p>;
  if (!entry) return <p className="text-gray-400">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Edit Experience</h1>
      <ExperienceForm initial={entry} />
    </div>
  );
}
