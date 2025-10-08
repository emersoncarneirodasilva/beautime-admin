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
      className={`${
        loading
          ? "bg-gray-400 cursor-not-allowed text-white"
          : "bg-[var(--color-error)] hover:bg-[#c53030] text-[var(--text-on-action)] transition-all"
      } ${className}`}
    >
      {loading ? "Excluindo..." : text}
    </button>
  );
}
