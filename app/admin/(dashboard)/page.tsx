"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { CertificationRecord, ExperienceRecord, ProjectRecord } from "@/lib/types";

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<"projects" | "experience" | "certifications">("projects");
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [experience, setExperience] = useState<ExperienceRecord[]>([]);
  const [certifications, setCertifications] = useState<CertificationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [projectsRes, experienceRes, certificationsRes] = await Promise.all([
      fetch("/api/projects").then((r) => r.json()),
      fetch("/api/experience").then((r) => r.json()),
      fetch("/api/certifications").then((r) => r.json()),
    ]);
    setProjects(projectsRes.projects ?? []);
    setExperience(experienceRes.experience ?? []);
    setCertifications(certificationsRes.certifications ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    loadData();
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm("Delete this experience entry? This cannot be undone.")) return;
    await fetch(`/api/admin/experience/${id}`, { method: "DELETE" });
    loadData();
  };

  const handleDeleteCertification = async (id: string) => {
    if (!confirm("Delete this certification? This cannot be undone.")) return;
    await fetch(`/api/admin/certifications/${id}`, { method: "DELETE" });
    loadData();
  };

  return (
    <div>
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setTab("projects")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold ${
            tab === "projects" ? "bg-[#FF6B35] text-white" : "bg-white/10 text-gray-300"
          }`}
        >
          Projects ({projects.length})
        </button>
        <button
          onClick={() => setTab("experience")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold ${
            tab === "experience" ? "bg-[#FF6B35] text-white" : "bg-white/10 text-gray-300"
          }`}
        >
          Experience ({experience.length})
        </button>
        <button
          onClick={() => setTab("certifications")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold ${
            tab === "certifications" ? "bg-[#FF6B35] text-white" : "bg-white/10 text-gray-300"
          }`}
        >
          Certifications ({certifications.length})
        </button>
      </div>

      {loading && <p className="text-gray-400">Loading...</p>}

      {!loading && tab === "projects" && (
        <div>
          <Link
            href="/admin/projects/new"
            className="inline-block mb-4 px-4 py-2 rounded-lg bg-[#FF6B35] text-white text-sm font-semibold"
          >
            + Add Project
          </Link>
          <div className="flex flex-col gap-2">
            {projects.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between px-4 py-3 rounded-lg bg-white/5 border border-white/10"
              >
                <div>
                  <p className="text-white font-medium">{p.title}</p>
                  <p className="text-gray-500 text-xs">{p.category.join(", ")}</p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/projects/${p.id}/edit`}
                    className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteProject(p.id)}
                    className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && tab === "experience" && (
        <div>
          <Link
            href="/admin/experience/new"
            className="inline-block mb-4 px-4 py-2 rounded-lg bg-[#FF6B35] text-white text-sm font-semibold"
          >
            + Add Experience
          </Link>
          <div className="flex flex-col gap-2">
            {experience.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between px-4 py-3 rounded-lg bg-white/5 border border-white/10"
              >
                <div>
                  <p className="text-white font-medium">{e.name}</p>
                  <p className="text-gray-500 text-xs">
                    {e.additional} {e.type ? `· ${e.type}` : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/experience/${e.id}/edit`}
                    className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteExperience(e.id)}
                    className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && tab === "certifications" && (
        <div>
          <Link
            href="/admin/certifications/new"
            className="inline-block mb-4 px-4 py-2 rounded-lg bg-[#FF6B35] text-white text-sm font-semibold"
          >
            + Add Certification
          </Link>
          <div className="flex flex-col gap-2">
            {certifications.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between px-4 py-3 rounded-lg bg-white/5 border border-white/10"
              >
                <p className="text-white font-medium">{c.title}</p>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/certifications/${c.id}/edit`}
                    className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteCertification(c.id)}
                    className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
