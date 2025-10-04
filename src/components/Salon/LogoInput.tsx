"use client";

import { useState, ChangeEvent } from "react";
import Image from "next/image";

interface LogoInputProps {
  name: string;
  defaultLogoUrl?: string;
}

export default function LogoInput({ name, defaultLogoUrl }: LogoInputProps) {
  const [preview, setPreview] = useState<string | null>(defaultLogoUrl || null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  }

  return (
    <div>
      <label
        htmlFor={name}
        className="block font-medium mb-2 text-[var(--foreground)]"
      >
        Logo (Imagem)
      </label>

      <div className="flex items-center gap-3">
        {preview && (
          <Image
            src={preview}
            alt="Preview da logo"
            width={56}
            height={56}
            className="object-cover rounded-md border border-[var(--color-gray-medium)]"
          />
        )}

        <div className="flex items-center gap-2">
          <label
            htmlFor={name}
            className="cursor-pointer px-3 py-2 rounded-md bg-[var(--color-primary)] text-[var(--text-white-fixed)] text-sm font-medium shadow hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            Selecionar
          </label>
          <span className="text-sm text-[var(--color-gray-medium)]">
            PNG, JPG, SVG
          </span>
        </div>

        <input
          type="file"
          id={name}
          name={name}
          accept="image/png, image/jpeg, image/svg+xml"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
