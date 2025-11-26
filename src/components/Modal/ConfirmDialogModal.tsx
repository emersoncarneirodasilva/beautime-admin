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
      className="fixed inset-0 z-50 flex items-center justify-center 
                 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          w-full max-w-sm p-6 rounded-xl shadow-lg
          bg-[var(--color-white)]
          border border-[var(--color-gray-medium)]
          dark:bg-[var(--color-gray-light)]
          animate-fadeIn
        "
      >
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">
          {title}
        </h2>

        <p className="text-sm text-[var(--text-secondary)] mb-6 leading-relaxed">
          {description}
        </p>

        <div className="flex justify-end gap-3">
          {/* Botão cancelar */}
          <button
            onClick={onClose}
            className="
              px-4 py-2 rounded-md text-sm font-medium
              border border-[var(--color-gray-medium)]
              text-[var(--foreground)]
              hover:bg-[var(--color-gray-light)]
              transition cursor-pointer
            "
          >
            {cancelText}
          </button>

          {/* Botão confirmar */}
          <button
            onClick={onConfirm}
            className="
              px-4 py-2 rounded-md text-sm font-medium
              bg-[var(--color-error)]
              text-[var(--text-white-fixed)]
              hover:bg-[#d62828]
              transition cursor-pointer
            "
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
