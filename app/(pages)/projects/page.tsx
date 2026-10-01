"use client";
import { useEffect, useState } from "react";
import Project from "@/components/Project";
import type { ProjectRecord } from "@/lib/types";

export default function Projects() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch projects");
        return r.json();
      })
      .then((json) => {
        setProjects(json.projects ?? []);
        setLoaded(true);
      })
      .catch(() => {
        setError(true);
        setLoaded(true);
      });
  }, []);

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Couldn&apos;t load projects right now. Please refresh.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div>
          {projects.map((project) => (
            <Project
              key={project.id}
              title={project.title}
              description={project.description ?? ""}
              images={project.images}
              technology={project.technology}
              weblink={project.demo ?? ""}
              github={project.github ?? ""}
              video={project.video ?? ""}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
