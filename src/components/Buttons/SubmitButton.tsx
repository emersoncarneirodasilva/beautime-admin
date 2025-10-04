"use client";

import { useState } from "react";
import { Save } from "lucide-react";

interface SubmitButtonProps {
  formId: string; // id do form Server Component
}

export default function SubmitButton({ formId }: SubmitButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    const form = document.getElementById(formId) as HTMLFormElement | null;

    if (!form) return;

    setLoading(true); // feedback visual

    form.requestSubmit(); // dispara o submit normal do Server Component
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center gap-2 px-6 py-3 rounded-md shadow-md font-semibold transition-all cursor-pointer
        ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[var(--color-action)] text-[var(--text-on-action)] hover:bg-[var(--color-action-hover)]"
        }
      `}
    >
      <Save size={18} />
      {loading ? "Salvando..." : "Salvar Alterações"}
    </button>
  );
}
