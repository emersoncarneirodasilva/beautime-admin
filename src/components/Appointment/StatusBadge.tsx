interface StatusBadgeProps {
  value: string;
  type: "appointment" | "payment";
}

export const StatusBadge = ({ value, type }: StatusBadgeProps) => {
  const colorMap =
    type === "appointment"
      ? {
          CONFIRMED: "bg-emerald-100 text-emerald-700",
          PENDING: "bg-amber-100 text-amber-700",
          CANCELED: "bg-red-100 text-red-700",
          COMPLETED: "bg-green-100 text-green-700",
        }
      : {
          PAID: "bg-blue-100 text-blue-700",
          PARTIALLY_PAID: "bg-purple-100 text-purple-700",
          REFUNDED: "bg-orange-100 text-orange-700",
          PENDING: "bg-gray-200 text-gray-700",
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
    colorMap[value as keyof typeof colorMap] ?? "bg-gray-200 text-gray-700";

  const translatedValue =
    translationMap[value as keyof typeof translationMap] ?? value;

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${colors}`}
    >
      {translatedValue}
    </span>
  );
};
