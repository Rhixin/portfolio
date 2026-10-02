"use client";
import { useEffect, useState, type FormEvent } from "react";
import type { SiteSettings } from "@/lib/types";

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [yearsExperience, setYearsExperience] = useState("");
  const [projectsCompleted, setProjectsCompleted] = useState("");
  const [clientsSatisfied, setClientsSatisfied] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((json) => {
        setSettings(json.settings);
        setYearsExperience(json.settings.years_experience);
        setProjectsCompleted(json.settings.projects_completed);
        setClientsSatisfied(json.settings.clients_satisfied);
      })
      .catch(() => {
        setError("Failed to load settings");
      });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          years_experience: yearsExperience,
          projects_completed: projectsCompleted,
          clients_satisfied: clientsSatisfied,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error ?? "Failed to save settings");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Network error — please try again");
    } finally {
      setSaving(false);
    }
  };

  if (!settings) return <p className="text-gray-400">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Homepage Stats</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-md">
        {error && (
          <p className="text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2 text-sm">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-400 bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2 text-sm">
            Saved!
          </p>
        )}

        <div>
          <label className="block text-gray-300 text-sm mb-1">Years of Experience</label>
          <input
            value={yearsExperience}
            onChange={(e) => setYearsExperience(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
            placeholder="e.g. 6+"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-1">Projects Completed</label>
          <input
            value={projectsCompleted}
            onChange={(e) => setProjectsCompleted(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
            placeholder="e.g. 100+"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-1">Clients Satisfied</label>
          <input
            value={clientsSatisfied}
            onChange={(e) => setClientsSatisfied(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
            placeholder="e.g. 40+"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-lg bg-[#FF6B35] text-white font-semibold disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
