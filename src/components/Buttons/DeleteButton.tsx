"use client";

import { ReactNode, useState } from "react";
import ConfirmDialogModal from "../Modal/ConfirmDialogModal";

interface DeleteButtonProps {
  formId: string;
  text?: string | ReactNode;
  confirmMessage?: string;
  className?: string;
}

export default function DeleteButton({
  formId,
  text = "Excluir",
  confirmMessage = "Tem certeza que deseja excluir?",
  className = "",
}: DeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    const form = document.getElementById(formId) as HTMLFormElement | null;
    if (!form) return;
    setLoading(true);
    form.requestSubmit();
  };

  return (
    <>
      <button
        type="button"
        disabled={loading}
        onClick={() => setOpen(true)}
        className={`
          ${loading ? "opacity-50 cursor-not-allowed" : ""}
          ${className}
        `}
      >
        {loading ? "Excluindo..." : text}
      </button>

      <ConfirmDialogModal
        open={open}
        title="Confirmar exclusão"
        description={confirmMessage}
        confirmText={loading ? "Excluindo..." : "Excluir"}
        onConfirm={handleConfirm}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
