type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  salonId: string;
};

type AppointmentService = {
  id: string;
  appointmentId: string;
  serviceId: string;
  professionalId: string;
  service: Service;
};

export type AppointmentsByProfessional = {
  id: string;
  userId: string;
  salonId: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  scheduledAt: string; // ISO datetime (ex: "2025-11-20T11:50:00.000Z")
  createdAt: string;
  updatedAt: string;
  services: AppointmentService[];
};
