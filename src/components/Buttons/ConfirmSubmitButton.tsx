"use client";

import { useState } from "react";
import ConfirmModal from "../Modal/ConfirmModal";
import { Save } from "lucide-react";

interface ConfirmSubmitButtonProps {
  formId: string;
  originalStatus: string;
  originalPaymentStatus: string;
  originalPaymentMethod: string;
}

export default function ConfirmSubmitButton({
  formId,
  originalStatus,
  originalPaymentStatus,
  originalPaymentMethod,
}: ConfirmSubmitButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleConfirm = () => {
    const form = document.getElementById(formId) as HTMLFormElement | null;
    if (!form) return;

    setLoading(true);
    form.requestSubmit();
  };

  // Seletores corretos para pegar os selects do form
  const form =
    typeof document !== "undefined" ? document.getElementById(formId) : null;

  const newStatus =
    (
      form?.querySelector(
        'select[name="newAppointmentStatus"]'
      ) as HTMLSelectElement
    )?.value || originalStatus;

  const newPaymentStatus =
    (
      form?.querySelector(
        'select[name="newPaymentStatus"]'
      ) as HTMLSelectElement
    )?.value || originalPaymentStatus;

  const newPaymentMethod =
    (
      form?.querySelector(
        'select[name="newPaymentMethod"]'
      ) as HTMLSelectElement
    )?.value || originalPaymentMethod;

  // Mapas de tradução
  const statusMap: Record<string, string> = {
    PENDING: "Pendente",
    CONFIRMED: "Confirmado",
    CANCELED: "Cancelado",
    COMPLETED: "Concluído",
  };

  const paymentStatusMap: Record<string, string> = {
    PENDING: "Pendente",
    PAID: "Pago",
    REFUNDED: "Reembolsado",
    PARTIALLY_PAID: "Parcialmente Pago",
  };

  const changes: string[] = [];
  if (newStatus !== originalStatus)
    changes.push(
      `Status do agendamento: ${statusMap[originalStatus]} → ${statusMap[newStatus]}`
    );
  if (newPaymentStatus !== originalPaymentStatus)
    changes.push(
      `Status do pagamento: ${paymentStatusMap[originalPaymentStatus]} → ${paymentStatusMap[newPaymentStatus]}`
    );
  if (newPaymentMethod !== originalPaymentMethod)
    changes.push(
      `Método de pagamento: ${originalPaymentMethod} → ${newPaymentMethod}`
    );

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`px-6 py-3 rounded-md shadow-md text-[var(--text-on-action)]
    ${
      loading
        ? "bg-[var(--color-action)] opacity-80 animate-pulse cursor-not-allowed"
        : "bg-[var(--color-action)] hover:bg-[var(--color-action-hover)] cursor-pointer"
    }`}
      >
        {loading ? (
          "Salvando..."
        ) : (
          <span className="flex items-center gap-2">
            <Save className="w-5 h-5" />
            Salvar alterações
          </span>
        )}
      </button>

      {open && (
        <ConfirmModal
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={handleConfirm}
          changes={changes}
        />
      )}
    </>
  );
}
