"use client";

import { useState } from "react";
import {
  UserPlus,
  Briefcase,
  Tag,
  UserCheck,
  ImagePlus,
  BellPlus,
  CalendarPlus,
  ClockPlus,
  Plus,
} from "lucide-react";

interface CreateButtonProps {
  formId: string;
  label?: string;
  iconType?:
    | "user"
    | "professional"
    | "service"
    | "category"
    | "schedule"
    | "availability"
    | "image"
    | "notification";
}

export default function CreateButton({
  formId,
  label = "Criar",
  iconType = "user",
}: CreateButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    const form = document.getElementById(formId) as HTMLFormElement | null;
    if (!form) return;

    if (!form.checkValidity()) {
      form.reportValidity(); // mostra mensagens nativas
      return;
    }

    setLoading(true);
    form.requestSubmit(); // dispara submit normal
  };

  const renderIcon = () => {
    switch (iconType) {
      case "user":
        return <UserPlus size={18} />;
      case "professional":
        return <UserCheck size={18} />;
      case "service":
        return <Briefcase size={18} />;
      case "category":
        return <Tag size={18} />;
      case "schedule":
        return <CalendarPlus size={18} />;
      case "image":
        return <ImagePlus size={18} />;
      case "notification":
        return <BellPlus size={18} />;
      case "availability":
        return <ClockPlus size={18} />;
      default:
        return <Plus size={18} />;
    }
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
            : "bg-[var(--color-action)] text-[var(--text-on-action)] hover:bg-[var(--color-action-hover)] duration-200"
        }`}
    >
      {renderIcon()}
      {loading ? "Criando..." : label}
    </button>
  );
}
