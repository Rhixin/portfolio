"use client";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { ExperienceRecord } from "@/lib/types";
import ImageUploader from "./ImageUploader";

const TYPES = ["Full-time", "Part-time", "Internship", "Contract"] as const;

export default function ExperienceForm({ initial }: { initial?: ExperienceRecord }) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const [name, setName] = useState(initial?.name ?? "");
  const [additional, setAdditional] = useState(initial?.additional ?? "");
  const [type, setType] = useState<string>(initial?.type ?? "");
  const [year, setYear] = useState(initial?.year ?? "");
  const [duration, setDuration] = useState(initial?.duration ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [referenceName, setReferenceName] = useState(initial?.reference_name ?? "");
  const [referenceTitle, setReferenceTitle] = useState(initial?.reference_title ?? "");
  const [referenceContact, setReferenceContact] = useState(initial?.reference_contact ?? "");
  const [referenceLink, setReferenceLink] = useState(initial?.reference_link ?? "");
  const [link, setLink] = useState(initial?.link ?? "");
  const [logo, setLogo] = useState<string[]>(initial?.logo ? [initial.logo] : []);
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 0);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setSaving(true);
    const payload = {
      name,
      additional,
      type: type || null,
      year,
      duration,
      description,
      reference_name: referenceName,
      reference_title: referenceTitle,
      reference_contact: referenceContact,
      reference_link: referenceLink,
      link,
      logo: logo[0] ?? null,
      sort_order: Number(sortOrder) || 0,
    };

    const url = isEdit ? `/api/admin/experience/${initial!.id}` : "/api/admin/experience";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Failed to save experience");
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

      <div>
        <label className="block text-gray-300 text-sm mb-1">Name *</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-1">Additional (role/subtitle)</label>
        <input
          value={additional}
          onChange={(e) => setAdditional(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-1">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
        >
          <option value="">None</option>
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-1">Year</label>
        <input
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="e.g. Mar 2025 – Aug 2025"
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-1">Duration</label>
        <input
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="e.g. 6 months"
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-1">
          Description (what you did here)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
        />
      </div>

      <div className="border-t border-white/10 pt-4">
        <p className="text-gray-300 text-sm font-semibold mb-3">Reference (optional)</p>
        <div className="flex flex-col gap-3">
          <input
            value={referenceName}
            onChange={(e) => setReferenceName(e.target.value)}
            placeholder="Name"
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
          />
          <input
            value={referenceTitle}
            onChange={(e) => setReferenceTitle(e.target.value)}
            placeholder="Title / Role"
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
          />
          <input
            value={referenceContact}
            onChange={(e) => setReferenceContact(e.target.value)}
            placeholder="Contact (email or phone)"
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
          />
          <input
            value={referenceLink}
            onChange={(e) => setReferenceLink(e.target.value)}
            placeholder="LinkedIn or other link"
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-1">Link (e.g. company website or LinkedIn)</label>
        <input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://..."
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-2">Logo</label>
        <ImageUploader images={logo} onChange={setLogo} multiple={false} />
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
        {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Experience"}
      </button>
    </form>
  );
}
