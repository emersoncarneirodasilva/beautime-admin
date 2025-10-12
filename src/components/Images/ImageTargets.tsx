"use client";

import { useState } from "react";

interface Props {
  professionals: { id: string; name: string }[];
  services: { id: string; name: string }[];
}

export default function ImageTargets({ professionals, services }: Props) {
  const [target, setTarget] = useState("");
  const [selectedProfessional, setSelectedProfessional] = useState("");
  const [selectedService, setSelectedService] = useState("");

  const isProfessionalEnabled = target === "professional";
  const isServiceEnabled = target === "service";

  return (
    <>
      {/* Tipo de Imagem */}
      <div>
        <label
          htmlFor="target"
          className="block font-medium mb-2 text-[var(--foreground)]"
        >
          Tipo de Imagem
        </label>
        <select
          id="target"
          name="target"
          value={target}
          onChange={(e) => {
            setTarget(e.target.value);
            setSelectedProfessional("");
            setSelectedService("");
          }}
          className="w-full px-4 py-3 rounded-xl border border-[var(--color-gray-medium)] bg-[var(--color-white)] dark:bg-[var(--color-gray-light)] focus:ring-2 focus:ring-[var(--color-action)] focus:outline-none transition"
          required
        >
          <option value="" disabled>
            Selecione
          </option>
          <option value="salon">Salão</option>
          <option value="professional">Profissional</option>
          <option value="service">Serviço</option>
        </select>
      </div>

      {/* Profissional */}
      <div>
        <label
          htmlFor="professionalId"
          className="block font-medium mb-2 text-[var(--foreground)]"
        >
          Profissional (se aplicável)
        </label>
        <select
          id="professionalId"
          name="professionalId"
          value={selectedProfessional}
          onChange={(e) => setSelectedProfessional(e.target.value)}
          disabled={!isProfessionalEnabled}
          className={`w-full px-4 py-3 rounded-xl border border-[var(--color-gray-medium)] focus:ring-2 focus:ring-[var(--color-action)] focus:outline-none transition
            ${
              isProfessionalEnabled
                ? "bg-[var(--color-white)] dark:bg-[var(--color-gray-light)] cursor-auto"
                : "bg-[var(--color-gray-light)] dark:bg-[var(--color-gray-medium)] cursor-not-allowed text-gray-400"
            }
          `}
        >
          <option value="" disabled>
            Selecione um profissional
          </option>
          {professionals.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Serviço */}
      <div>
        <label
          htmlFor="serviceId"
          className="block font-medium mb-2 text-[var(--foreground)]"
        >
          Serviço (se aplicável)
        </label>
        <select
          id="serviceId"
          name="serviceId"
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          disabled={!isServiceEnabled}
          className={`w-full px-4 py-3 rounded-xl border border-[var(--color-gray-medium)] focus:ring-2 focus:ring-[var(--color-action)] focus:outline-none transition
            ${
              isServiceEnabled
                ? "bg-[var(--color-white)] dark:bg-[var(--color-gray-light)] cursor-auto"
                : "bg-[var(--color-gray-light)] dark:bg-[var(--color-gray-medium)] cursor-not-allowed text-gray-400"
            }
          `}
        >
          <option value="" disabled>
            Selecione um serviço
          </option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
