"use client";

import { useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface ActionButtonProps {
  href: string;
  text: string | ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "tertiary" | "danger" | "info";
}

export default function ActionButton({
  href,
  text,
  className = "",
  variant = "primary",
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
      className={`ui-button ui-button--${variant} ${
        loading ? "ui-button--disabled" : ""
      } ${className}`}
    >
      {loading ? "Carregando..." : text}
    </button>
  );
}
