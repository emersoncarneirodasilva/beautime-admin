"use client";

import { useState } from "react";
import { ServiceProfessional } from "@/types";
import ServiceModal from "./ServiceModal";

interface ServiceSelectorProps {
  token: string;
  onSelectService: (
    serviceId: string,
    professionalId: string,
    duration: number
  ) => void;
}

export default function ServiceSelector({
  token,
  onSelectService,
}: ServiceSelectorProps) {
  const [selectedService, setSelectedService] =
    useState<ServiceProfessional | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (service: ServiceProfessional) => {
    setSelectedService(service);
    onSelectService(
      service.id,
      service.professional.id,
      service.service.duration
    );
    setIsOpen(false);
  };

  return (
    <section className="space-y-6">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="ui-button ui-button--secondary"
      >
        {selectedService ? "Alterar serviço" : "Selecionar serviço"}
      </button>

      {selectedService && (
        <div className="mt-4 rounded-xl border border-[var(--color-gray-medium)] bg-[var(--color-white)] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
            Seleção atual
          </p>
          <p className="mt-1 font-semibold text-[var(--foreground)]">
            {selectedService.service.name}
          </p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Profissional: {selectedService.professional.name}
          </p>
        </div>
      )}

      {isOpen && (
        <ServiceModal
          token={token}
          onClose={() => setIsOpen(false)}
          onSelect={handleSelect}
        />
      )}
    </section>
  );
}
