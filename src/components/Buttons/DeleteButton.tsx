"use client";

import { useState } from "react";

interface DeleteButtonProps {
  formId: string;
  text?: string | React.ReactNode;
  confirmMessage?: string;
  className?: string;
}

export default function DeleteButton({
  formId,
  text = "Excluir",
  confirmMessage = "Tem certeza que deseja excluir?",
  className = "",
}: DeleteButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!confirm(confirmMessage)) return;

    const form = document.getElementById(formId) as HTMLFormElement | null;
    if (!form) {
      console.error(`Form com id "${formId}" não encontrado.`);
      return;
    }

    setLoading(true);
    form.requestSubmit();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`px-5 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
        loading
          ? "bg-gray-400 cursor-not-allowed text-white"
          : "bg-[var(--color-error)] hover:bg-[#c53030] text-[var(--text-on-action)]"
      } ${className}`}
    >
      {loading ? "Excluindo..." : text}
    </button>
  );
}
