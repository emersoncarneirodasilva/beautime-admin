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
        return (
          <span
            className="relative inline-flex h-[18px] w-[18px] items-center justify-center"
            aria-hidden="true"
          >
            <Briefcase size={18} />
            <Plus
              size={10}
              strokeWidth={3}
              className="absolute -right-1 -top-1 rounded-full bg-[var(--color-action)]"
            />
          </span>
        );
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
      className={`ui-button ui-button--primary ${
        loading ? "ui-button--disabled" : ""
      }`}
    >
      {renderIcon()}
      {loading ? "Criando..." : label}
    </button>
  );
}
