"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface EditButtonProps {
  formId: string;
  href: string;
  text?: string | React.ReactNode;
  className?: string;
}

export default function EditButton({
  href,
  text = "Editar",
  className,
  formId,
}: EditButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    setLoading(true);
    router.push(href);
  };

  return (
    <button
      type="button"
      form={formId}
      onClick={handleClick}
      disabled={loading}
      className={`ui-button ui-button--secondary min-w-0 max-w-full ${className ?? ""} ${
        loading ? "ui-button--disabled" : ""
      }`}
    >
      <span className="inline-flex min-w-0 flex-wrap items-center justify-center gap-2 text-center leading-tight">
        {loading ? "Carregando..." : text}
      </span>
    </button>
  );
}
