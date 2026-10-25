"use client";

interface PaymentMethodSelectorProps {
  onSelect: (method: string) => void;
}

export default function PaymentMethodSelector({
  onSelect,
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor="appointment-payment-method"
        className="block text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]"
      >
        Forma de pagamento
      </label>
      <select
        id="appointment-payment-method"
        className="w-full"
        defaultValue=""
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="" disabled>
          Selecione
        </option>
        <option value="A VISTA">A VISTA</option>
        <option value="CARTÃO DE CRÉDITO">CARTÃO DE CRÉDITO</option>
        <option value="CARTÃO DE DÉBITO">CARTÃO DE DÉBITO</option>
        <option value="PIX">PIX</option>
        <option value="BOLETO">BOLETO</option>
      </select>
    </div>
  );
}
