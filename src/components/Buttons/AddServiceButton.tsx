"use client";

import { useState } from "react";

interface AddServiceButtonProps {
  formId: string;
  className?: string;
}

export default function AddServiceButton({
  formId,
  className,
}: AddServiceButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    const form = document.getElementById(formId) as HTMLFormElement | null;
    if (!form) return;

    // Verifica se o form é válido antes de mudar o estado
    if (!form.checkValidity()) {
      form.reportValidity(); // mostra mensagem de erro nativa
      return;
    }

    setLoading(true);
    form.requestSubmit(); // submete respeitando validação
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`${className} transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {loading ? "Vinculando..." : "Vincular"}
    </button>
  );
}
