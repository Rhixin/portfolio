import type { ExperienceRecord, ProjectRecord } from "./types";

const ALLOWED_CATEGORIES = ["mobile", "web", "automations", "games"];
const EXPERIENCE_TYPES = ["Full-time", "Part-time", "Internship", "Contract"];

export type ProjectInput = Omit<ProjectRecord, "created_at">;
export type ExperienceInput = Omit<ExperienceRecord, "created_at" | "id">;

type Result<T> = { data: T; error?: undefined } | { data?: undefined; error: string };

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === "string")
    .map((v) => v.trim())
    .filter((v) => v.length > 0);
}

function toNullableString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function sanitizeProjectInput(body: unknown): Result<ProjectInput> {
  if (typeof body !== "object" || body === null) {
    return { error: "Request body must be an object" };
  }
  const b = body as Record<string, unknown>;

  const id = typeof b.id === "string" ? b.id.trim() : "";
  if (!id) return { error: "id is required" };

  const title = typeof b.title === "string" ? b.title.trim() : "";
  if (!title) return { error: "title is required" };

  const category = toStringArray(b.category).filter((c) =>
    ALLOWED_CATEGORIES.includes(c)
  );

  return {
    data: {
      id,
      title,
      category,
      description: toNullableString(b.description),
      images: toStringArray(b.images),
      technology: toStringArray(b.technology),
      github: toNullableString(b.github),
      demo: toNullableString(b.demo),
      video: toNullableString(b.video),
      sort_order: typeof b.sort_order === "number" ? b.sort_order : 0,
    },
  };
}

export function sanitizeExperienceInput(body: unknown): Result<ExperienceInput> {
  if (typeof body !== "object" || body === null) {
    return { error: "Request body must be an object" };
  }
  const b = body as Record<string, unknown>;

  const name = typeof b.name === "string" ? b.name.trim() : "";
  if (!name) return { error: "name is required" };

  const rawType = typeof b.type === "string" ? b.type : null;
  const type = EXPERIENCE_TYPES.includes(rawType ?? "")
    ? (rawType as ExperienceInput["type"])
    : null;

  return {
    data: {
      name,
      logo: toNullableString(b.logo),
      additional: toNullableString(b.additional),
      type,
      year: toNullableString(b.year),
      duration: toNullableString(b.duration),
      sort_order: typeof b.sort_order === "number" ? b.sort_order : 0,
    },
  };
}
