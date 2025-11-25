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
    onConfirm(); // executa a ação
    onClose(); // fecha o modal imediatamente
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[var(--color-gray-light)] p-6 rounded-2xl max-w-md w-full shadow-lg">
        <h2 className="text-xl font-bold mb-4">Confirmar alterações</h2>
        <ul className="list-disc list-inside mb-4 text-sm">
          {changes.length === 0 ? (
            <li>Nenhuma mudança detectada.</li>
          ) : (
            changes.map((c, i) => <li key={i}>{c}</li>)
          )}
        </ul>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-[var(--color-action)] text-[var(--text-on-action)] rounded-md cursor-pointer"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
