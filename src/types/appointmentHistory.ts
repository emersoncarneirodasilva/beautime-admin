export interface AppointmentHistoryResponse {
  total: number;
  currentPage: number;
  totalPages: number;
  appointmentsHistory: AppointmentHistoryType[];
}

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
  }[];
}
