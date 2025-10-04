"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface EditButtonProps {
  href: string;
}

export default function EditButton({ href }: EditButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    setLoading(true);

    router.push(href);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded transition-colors font-medium cursor-pointer ${
        loading
          ? "bg-gray-400 cursor-not-allowed text-white"
          : "bg-[var(--color-action)] text-[var(--text-on-action)] hover:bg-[var(--color-action-hover)]"
      }`}
    >
      {loading ? "Carregando..." : "Editar Salão"}
    </button>
  );
}
