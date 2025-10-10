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
      className={`${className ?? ""} ${
        loading ? "opacity-70 cursor-not-allowed" : ""
      }`}
    >
      {loading ? "Carregando..." : text}
    </button>
  );
}
