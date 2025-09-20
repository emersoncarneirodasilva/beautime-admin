export interface AppointmentHistoryType {
  id: string;
  originalId: string;
  userId: string;
  salonId: string;
  status: "CANCELED" | "COMPLETED";
  scheduledAt: string;
  movedAt: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  services: {
    id: string;
    appointmentId: string;
    serviceId: string;
    professionalId: string;
    price: number;
    duration: number;
  }[];
}
