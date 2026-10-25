"use client";

import { useEffect } from "react";

interface ConfirmDialogModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmDialogModal({
  open,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onClose,
}: ConfirmDialogModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md animate-fadeIn rounded-2xl border border-[var(--color-gray-medium)] bg-[var(--color-white)] p-6 shadow-2xl sm:p-7"
      >
        <h2 id="confirm-dialog-title" className="mb-2 text-lg font-semibold text-[var(--foreground)]">
          {title}
        </h2>

        <p id="confirm-dialog-description" className="mb-6 text-sm leading-relaxed text-[var(--text-secondary)]">
          {description}
        </p>

        <div className="flex justify-end gap-3">
          {/* Botão cancelar */}
          <button
            onClick={onClose}
            className="ui-button ui-button--secondary"
          >
            {cancelText}
          </button>

          {/* Botão confirmar */}
          <button
            onClick={onConfirm}
            className="ui-button ui-button--danger"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
