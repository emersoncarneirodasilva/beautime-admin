interface StatusBadgeProps {
  value: string;
  type: "appointment" | "payment";
}

export const StatusBadge = ({ value, type }: StatusBadgeProps) => {
  const colorMap =
    type === "appointment"
      ? {
          CONFIRMED: "bg-[var(--color-info-soft)] text-[var(--color-info)]",
          PENDING: "bg-[var(--color-warning-soft)] text-[var(--color-warning)]",
          CANCELED: "bg-[var(--color-error-soft)] text-[var(--color-error)]",
          COMPLETED: "bg-[var(--color-success-soft)] text-[var(--color-success)]",
        }
      : {
          PAID: "bg-[var(--color-success-soft)] text-[var(--color-success)]",
          PARTIALLY_PAID: "bg-[var(--color-warning-soft)] text-[var(--color-warning)]",
          REFUNDED: "bg-[var(--color-info-soft)] text-[var(--color-info)]",
          PENDING: "bg-[var(--color-gray-light)] text-[var(--text-secondary)]",
        };

  const translationMap =
    type === "appointment"
      ? {
          CONFIRMED: "Confirmado",
          PENDING: "Pendente",
          CANCELED: "Cancelado",
          COMPLETED: "Concluído",
        }
      : {
          PAID: "Pago",
          PARTIALLY_PAID: "Parcialmente pago",
          REFUNDED: "Reembolsado",
          PENDING: "Pendente",
        };

  const colors =
    colorMap[value as keyof typeof colorMap] ??
    "bg-[var(--color-gray-light)] text-[var(--text-secondary)]";

  const translatedValue =
    translationMap[value as keyof typeof translationMap] ?? value;

  return (
    <span
      className={`inline-flex items-center rounded-full border border-current/10 px-2.5 py-1 text-[11px] font-semibold tracking-wide ${colors}`}
    >
      {translatedValue}
    </span>
  );
};
