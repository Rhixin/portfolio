"use client";
import { use, useEffect, useState } from "react";
import CertificationForm from "@/components/admin/CertificationForm";
import type { CertificationRecord } from "@/lib/types";

export default function EditCertificationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [certification, setCertification] = useState<CertificationRecord | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch("/api/certifications")
      .then((r) => r.json())
      .then((json) => {
        const found = (json.certifications as CertificationRecord[]).find((c) => c.id === id);
        if (!found) {
          setNotFound(true);
          return;
        }
        setCertification(found);
      });
  }, [id]);

  if (notFound) return <p className="text-gray-400">Certification not found.</p>;
  if (!certification) return <p className="text-gray-400">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Edit Certification</h1>
      <CertificationForm initial={certification} />
    </div>
  );
}
