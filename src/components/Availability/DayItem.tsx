"use client";

import { Availability } from "@/hooks/useAvailability";
import { generateTimeSlots } from "@/utils/dateHelpers";

export default function DayItem({
  date,
  slots,
  serviceDuration,
  onSelect,
}: {
  date: Date;
  slots: Availability[];
  serviceDuration: number;
  onSelect: (data: {
    date: string;
    startTime: string;
    endTime: string;
  }) => void;
}) {
  return (
    <div key={date.toISOString()} className="p-4 space-y-3">
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
          serviceDuration
        );

        return (
          <div key={slot.id} className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {times.map((time) => (
              <button
                key={time}
                className="
                  px-3 py-2 rounded-md 
                  bg-[var(--color-action)] hover:bg-[var(--color-action-hover)]
                  text-[var(--text-on-action)] text-sm
                  transition cursor-pointer
                "
                onClick={() =>
                  onSelect({
                    date: date.toLocaleDateString("fr-CA"),
                    startTime: time,
                    endTime: slot.endTime,
                  })
                }
              >
                {time}
              </button>
            ))}
          </div>
        );
      })}
    </div>
  );
}
