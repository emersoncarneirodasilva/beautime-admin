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
          serviceDuration
        );

        return (
          <div key={slot.id} className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {times.map((time) => {
              const occupied = isTimeSlotOccupied(
                time,
                date,
                serviceDuration,
                appointments
              );

              return (
                <button
                  key={time}
                  disabled={occupied}
                  className={`
                    px-3 py-2 rounded-md text-sm transition
                    ${
                      occupied
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-[var(--color-action)] hover:bg-[var(--color-action-hover)] text-[var(--text-on-action)] cursor-pointer"
                    }
                  `}
                  onClick={() =>
                    !occupied &&
                    onSelect({
                      date: date.toISOString().split("T")[0],
                      startTime: time,
                      endTime: minutesToTime(
                        timeToMinutes(time) + serviceDuration
                      ),
                    })
                  }
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
