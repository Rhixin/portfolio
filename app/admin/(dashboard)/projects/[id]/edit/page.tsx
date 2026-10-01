"use client";
import { use, useEffect, useState } from "react";
import ProjectForm from "@/components/admin/ProjectForm";
import type { ProjectRecord } from "@/lib/types";

export default function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [project, setProject] = useState<ProjectRecord | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((json) => {
        const found = (json.projects as ProjectRecord[]).find((p) => p.id === id);
        if (!found) {
          setNotFound(true);
          return;
        }
        setProject(found);
      });
  }, [id]);

  if (notFound) return <p className="text-gray-400">Project not found.</p>;
  if (!project) return <p className="text-gray-400">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Edit Project</h1>
      <ProjectForm initial={project} />
    </div>
  );
}
