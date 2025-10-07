"use client";

import { useState } from "react";
import Image from "next/image";

interface AvatarUploadProps {
  currentAvatar?: string | null;
  name: string;
}

export default function AvatarUpload({
  currentAvatar,
  name,
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentAvatar || null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  }

  return (
    <div className="flex flex-col items-center text-center">
      <label
        htmlFor="avatar"
        className="block font-medium text-[var(--foreground)] mb-4"
      >
        Foto do Profissional
      </label>

      <div className="relative group">
        <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[var(--color-action)] shadow-md transition-transform duration-300 group-hover:scale-105">
          <Image
            src={preview || "/images/default-avatar.png"}
            alt={name}
            width={160}
            height={160}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Overlay ao passar o mouse */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-full">
          <label
            htmlFor="avatar"
            className="bg-[var(--color-action)] text-[var(--text-on-action)] text-sm px-4 py-2 rounded-lg cursor-pointer font-medium shadow hover:bg-[var(--color-action-hover)] transition"
          >
            Alterar
          </label>
        </div>
      </div>

      <input
        id="avatar"
        name="avatar"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <p className="text-sm text-[var(--text-secondary)] mt-3">
        Formatos suportados: PNG, JPG, SVG
      </p>
    </div>
  );
}
