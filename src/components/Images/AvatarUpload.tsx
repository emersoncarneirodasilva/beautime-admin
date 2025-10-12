"use client";

import { useState } from "react";
import Image from "next/image";

interface AvatarUploadProps {
  currentFile?: string | null; // URL atual do arquivo (avatar, imagem, etc)
  fieldName: string; // nome do campo que será enviado no formData
  title: string; // título exibido acima
  altText?: string; // texto alternativo da imagem
}

export default function AvatarUpload({
  currentFile,
  fieldName,
  title,
  altText,
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentFile || null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  }

  return (
    <div className="flex flex-col items-center text-center">
      <label htmlFor={fieldName} className="block font-medium mb-4">
        {title}
      </label>

      <div className="relative group">
        <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-blue-500 shadow-md transition-transform duration-300 group-hover:scale-105">
          <Image
            src={preview || "/images/default-avatar.png"}
            alt={altText || title}
            width={160}
            height={160}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Overlay ao passar o mouse */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-full">
          <label
            htmlFor={fieldName}
            className="bg-blue-500 text-[var(--text-on-action)] text-sm px-4 py-2 rounded-lg cursor-pointer font-medium shadow hover:bg-blue-600 transition"
          >
            Alterar
          </label>
        </div>
      </div>

      <input
        id={fieldName}
        name={fieldName}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <p className="text-sm text-gray-500 mt-3">
        Formatos suportados: PNG, JPG, SVG
      </p>
    </div>
  );
}
