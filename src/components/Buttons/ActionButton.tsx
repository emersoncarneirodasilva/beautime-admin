"use client";

import { useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface ActionButtonProps {
  href: string;
  text: string | ReactNode;
  className?: string;
}

export default function ActionButton({
  href,
  text,
  className = "",
}: ActionButtonProps) {
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
      className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
        loading
          ? "bg-gray-400 cursor-not-allowed text-white"
          : "bg-[var(--color-action)] text-[var(--text-on-action)] hover:bg-[var(--color-action-hover)]"
      } ${className}`}
    >
      {loading ? "Carregando..." : text}
    </button>
  );
}
