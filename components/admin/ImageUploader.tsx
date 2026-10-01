"use client";
import { useRef, useState } from "react";
import Image from "next/image";

export default function ImageUploader({
  images,
  onChange,
  multiple = true,
}: {
  images: string[];
  onChange: (urls: string[]) => void;
  multiple?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setError(`"${file.name}" is not an image file`);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(`"${file.name}" exceeds the 4MB size limit`);
        return;
      }
    }

    setUploading(true);
    setError(null);

    const uploadedUrls: string[] = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("files", file);

        try {
          const res = await fetch("/api/admin/upload", {
            method: "POST",
            body: formData,
          });
          const json = await res.json();
          if (!res.ok) {
            setError(json.error ?? `Upload failed for "${file.name}"`);
            return;
          }
          const newUrls: string[] = json.urls;
          uploadedUrls.push(...newUrls);
        } catch {
          setError(`Upload failed for "${file.name}"`);
          return;
        }
      }
    } finally {
      if (uploadedUrls.length > 0) {
        onChange(multiple ? [...images, ...uploadedUrls] : uploadedUrls.slice(0, 1));
      }
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeAt = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        disabled={uploading}
        onChange={(e) => handleFiles(e.target.files)}
        className="block w-full text-sm text-gray-300 mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
      />
      {uploading && <p className="text-gray-400 text-sm mb-2">Uploading...</p>}
      {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
      <div className="flex flex-wrap gap-3">
        {images.map((url, i) => (
          <div
            key={url + i}
            className="relative w-24 h-24 rounded-lg overflow-hidden bg-black/40"
          >
            <Image src={url} alt={`Image ${i + 1}`} fill className="object-cover" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              disabled={uploading}
              className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-black/70 rounded-full text-white text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
