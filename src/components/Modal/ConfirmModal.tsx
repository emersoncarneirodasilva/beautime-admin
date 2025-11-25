"use client";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  changes: string[];
}

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  changes,
}: ConfirmModalProps) {
  if (!open) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div
        className="
          p-6 rounded-2xl max-w-md w-full shadow-lg
          border border-[var(--color-gray-medium)]/30
          bg-[var(--color-white)]
        "
      >
        <h2 className="text-xl font-semibold mb-4 text-[var(--foreground)]">
          Confirmar alterações
        </h2>

        <ul className="list-disc list-inside mb-6 space-y-2 text-sm text-[var(--text-secondary)]">
          {changes.length === 0 ? (
            <li className="opacity-70">Nenhuma mudança detectada.</li>
          ) : (
            changes.map((c, i) => (
              <li key={i} className="leading-relaxed">
                {c}
              </li>
            ))
          )}
        </ul>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="
              px-4 py-2 rounded-md
              border border-[var(--color-gray-medium)]/50
              text-[var(--text-secondary)]
              hover:bg-[var(--color-gray-light)]
              transition-colors cursor-pointer
            "
          >
            Cancelar
          </button>

          <button
            onClick={handleConfirm}
            className="
              px-4 py-2 rounded-md cursor-pointer
              bg-[var(--color-action)] text-[var(--text-on-action)]
              hover:bg-[var(--color-action-hover)]
              transition-all shadow-sm active:scale-[0.98]
            "
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
