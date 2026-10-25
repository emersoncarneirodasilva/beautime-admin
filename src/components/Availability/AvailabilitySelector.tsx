"use client";

import { useState } from "react";
import AvailabilityModal from "./AvailabilityModal";

interface AvailabilitySelectorProps {
  token: string;
  professionalId: string;
  serviceDuration: number;
  onSelectDateTime: (date: string, time: string) => void;
}

export default function AvailabilitySelector({
  token,
  professionalId,
  serviceDuration,
  onSelectDateTime,
}: AvailabilitySelectorProps) {
  const [openModal, setOpenModal] = useState(false);

  const [chosenDate, setChosenDate] = useState("");
  const [chosenTime, setChosenTime] = useState("");

  return (
    <div className="space-y-3">
      {chosenDate && chosenTime && (
        <div className="mb-3 rounded-xl border border-[var(--color-gray-medium)] bg-[var(--color-white)] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
            Horário selecionado
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
            <span>
              {(() => {
                const [y, m, d] = chosenDate.split("-");
                return `${d}/${m}/${y} às ${chosenTime}`;
              })()}
            </span>
          </p>
        </div>
      )}

      <button
        type="button"
        className="ui-button ui-button--secondary w-full"
        onClick={() => setOpenModal(true)}
      >
        {chosenDate && chosenTime ? "Alterar dia e horário" : "Escolher dia e horário"}
      </button>

      {openModal && (
        <AvailabilityModal
          token={token}
          professionalId={professionalId}
          serviceDuration={serviceDuration}
          onClose={() => setOpenModal(false)}
          onSelect={({ date, startTime }) => {
            setChosenDate(date);
            setChosenTime(startTime);
            onSelectDateTime(date, startTime);
            setOpenModal(false);
          }}
        />
      )}
    </div>
  );
}
