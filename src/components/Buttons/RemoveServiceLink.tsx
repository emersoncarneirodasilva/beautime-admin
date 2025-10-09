"use client";

import { useState } from "react";

interface RemoveServiceLinkProps {
  formId: string; // ID do form que será submetido
  defaultText?: string;
  submittingText?: string;
  className?: string;
}

export default function RemoveServiceLink({
  formId,
  defaultText = "Remover",
  submittingText = "Removendo...",
  className = "",
}: RemoveServiceLinkProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const form = document.getElementById(formId) as HTMLFormElement | null;

    if (!form) {
      console.error(`Formulário com id "${formId}" não encontrado`);
      return;
    }

    setIsSubmitting(true);
    form.requestSubmit();
  };

  return (
    <a href="#" onClick={handleClick} className={`${className} cursor-pointer`}>
      {isSubmitting ? submittingText : defaultText}
    </a>
  );
}
