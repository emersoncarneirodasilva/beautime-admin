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
        onClick={() => setIsOpen(true)}
        className="px-5 py-2.5 rounded-md bg-[var(--color-action)] text-[var(--text-on-action)] hover:bg-[var(--color-action-hover)] cursor-pointer transition-colors"
      >
        Selecionar Serviço
      </button>

      {selectedService && (
        <div className="p-4 rounded-lg shadow-sm border bg-[var(--color-white)] border-[var(--color-gray-light)]">
          <p className="font-semibold">{selectedService.service.name}</p>
          <p className="text-sm text-gray-500">
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
