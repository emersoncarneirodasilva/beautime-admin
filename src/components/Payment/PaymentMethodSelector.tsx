"use client";

interface PaymentMethodSelectorProps {
  onSelect: (method: string) => void;
}

export default function PaymentMethodSelector({
  onSelect,
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-2">
      <p className="font-semibold">Escolha o método de pagamento:</p>
      <select
        className="border rounded px-3 py-2 w-full bg-white focus:border-none focus:ring-2 focus:ring-[var(--color-action)] transition-all"
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
