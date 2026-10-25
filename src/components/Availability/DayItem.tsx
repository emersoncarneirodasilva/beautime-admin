"use client";

import { generateTimeSlots } from "@/utils/dateHelpers";
import { AppointmentsByProfessional } from "@/types";
import {
  timeToMinutes,
  minutesToTime,
  isTimeSlotOccupied,
} from "@/utils/availabilityUtils";

export default function DayItem({
  date,
  slots,
  serviceDuration,
  onSelect,
  appointments,
}: {
  date: Date;
  slots: { id: string; startTime: string; endTime: string }[];
  serviceDuration: number;
  onSelect: (data: {
    date: string;
    startTime: string;
    endTime: string;
  }) => void;
  appointments: AppointmentsByProfessional[];
}) {
  return (
    <div className="p-4 space-y-3">
      <p className="font-medium text-[var(--foreground)]">
        {date.toLocaleDateString("pt-BR", {
          weekday: "long",
          day: "2-digit",
          month: "2-digit",
        })}
      </p>

      {slots.map((slot) => {
        const times = generateTimeSlots(
          slot.startTime,
          slot.endTime,
          serviceDuration,
        );

        return (
          <div key={slot.id} className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {times.map((time) => {
              const occupied = isTimeSlotOccupied(
                time,
                date,
                serviceDuration,
                appointments,
              );

              return (
                <button
                  key={time}
                  disabled={occupied}
                  className={`
                    ui-button ui-button--primary ui-button--compact
                    ${
                      occupied
                        ? "cursor-not-allowed"
                        : ""
                    }
                  `}
                  onClick={() => {
                    if (!occupied) {
                      // 1. Extrai o Ano, Mês e Dia respeitando o fuso horário local do navegador do Admin
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(
                        2,
                        "0",
                      ); // Mês começa em 0
                      const day = String(date.getDate()).padStart(2, "0");
                      const localDateStr = `${year}-${month}-${day}`; // Retorna "YYYY-MM-DD" correto

                      onSelect({
                        date: localDateStr,
                        startTime: time,
                        endTime: minutesToTime(
                          timeToMinutes(time) + serviceDuration,
                        ),
                      });
                    }
                  }}
                >
                  {time}
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
