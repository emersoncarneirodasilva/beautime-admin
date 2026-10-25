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

    // Verifica se o form é válido antes de submeter
    if (!form.reportValidity()) {
      return;
    }

    setLoading(true); // feedback visual

    form.requestSubmit(); // dispara o submit normal do Server Component
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`ui-button ui-button--primary ${
        loading ? "ui-button--disabled" : ""
      }`}
    >
      <Save size={18} />
      {loading ? "Salvando..." : "Salvar Alterações"}
    </button>
  );
}
