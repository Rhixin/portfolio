export interface ProjectRecord {
  id: string;
  title: string;
  category: string[];
  description: string | null;
  images: string[];
  technology: string[];
  github: string | null;
  demo: string | null;
  video: string | null;
  sort_order: number;
  created_at: string;
}

export interface ExperienceRecord {
  id: string;
  logo: string | null;
  name: string;
  additional: string | null;
  type: "Full-time" | "Part-time" | "Internship" | "Contract" | null;
  year: string | null;
  duration: string | null;
  link: string | null;
  sort_order: number;
  created_at: string;
}

export interface CertificationRecord {
  id: string;
  title: string;
  image: string | null;
  sort_order: number;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  years_experience: string;
  projects_completed: string;
  clients_satisfied: string;
}
