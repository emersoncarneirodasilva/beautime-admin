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
        <div className="p-4 rounded-lg shadow-sm border bg-[var(--color-white)] border-[var(--color-gray-light)]">
          <p className="text-sm font-semibold text-[var(--foreground)]">
            Selecionado:{" "}
            <span className="font-bold">
              {(() => {
                const [y, m, d] = chosenDate.split("-");
                return `${d}/${m}/${y} às ${chosenTime}`;
              })()}
            </span>
          </p>
        </div>
      )}

      <button
        className="w-full py-3 rounded-md bg-[var(--color-action)] text-[var(--text-on-action)] font-semibold shadow hover:bg-[var(--color-action-hover)] cursor-pointer transition-all"
        onClick={() => setOpenModal(true)}
      >
        Escolher dia e hora
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
