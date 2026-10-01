"use client";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { ProjectRecord } from "@/lib/types";
import ImageUploader from "./ImageUploader";

const CATEGORIES = ["mobile", "web", "automations", "games"] as const;

export default function ProjectForm({ initial }: { initial?: ProjectRecord }) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const [id, setId] = useState(initial?.id ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState<string[]>(initial?.category ?? []);
  const [description, setDescription] = useState(initial?.description ?? "");
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [technology, setTechnology] = useState((initial?.technology ?? []).join(", "));
  const [github, setGithub] = useState(initial?.github ?? "");
  const [demo, setDemo] = useState(initial?.demo ?? "");
  const [video, setVideo] = useState(initial?.video ?? "");
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 0);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const toggleCategory = (cat: string) => {
    setCategory((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!isEdit && !id.trim()) {
      setError("ID is required");
      return;
    }

    setSaving(true);
    const payload = {
      id,
      title,
      category,
      description,
      images,
      technology: technology.split(",").map((t) => t.trim()).filter(Boolean),
      github,
      demo,
      video,
      sort_order: Number(sortOrder) || 0,
    };

    const url = isEdit ? `/api/admin/projects/${initial!.id}` : "/api/admin/projects";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Failed to save project");
        return;
      }
      router.push("/admin");
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-2xl">
      {error && (
        <p className="text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2 text-sm">
          {error}
        </p>
      )}

      {!isEdit && (
        <div>
          <label className="block text-gray-300 text-sm mb-1">
            ID (slug, lowercase, no spaces) *
          </label>
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
            placeholder="e.g. wingsagrivet"
          />
        </div>
      )}

      <div>
        <label className="block text-gray-300 text-sm mb-1">Title *</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-2">Category</label>
        <div className="flex gap-3 flex-wrap">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-2 text-gray-300 text-sm">
              <input
                type="checkbox"
                checked={category.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-2">Images</label>
        <ImageUploader images={images} onChange={setImages} multiple />
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-1">Technology (comma-separated)</label>
        <input
          value={technology}
          onChange={(e) => setTechnology(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
          placeholder="React, Next.js, Tailwind"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-1">GitHub URL</label>
        <input
          value={github}
          onChange={(e) => setGithub(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-1">Demo URL</label>
        <input
          value={demo}
          onChange={(e) => setDemo(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-1">Video URL</label>
        <input
          value={video}
          onChange={(e) => setVideo(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-1">Sort Order</label>
        <input
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(Number(e.target.value))}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="px-6 py-3 rounded-lg bg-[#FF6B35] text-white font-semibold disabled:opacity-50"
      >
        {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Project"}
      </button>
    </form>
  );
}
