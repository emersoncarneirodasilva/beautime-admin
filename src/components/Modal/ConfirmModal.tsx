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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-changes-title"
        className="w-full max-w-md rounded-2xl border border-[var(--color-gray-medium)] bg-[var(--color-white)] p-6 shadow-2xl sm:p-7"
      >
        <h2 id="confirm-changes-title" className="mb-4 text-xl font-semibold text-[var(--foreground)]">
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
            className="ui-button ui-button--secondary"
          >
            Cancelar
          </button>

          <button
            onClick={handleConfirm}
            className="ui-button ui-button--primary"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
