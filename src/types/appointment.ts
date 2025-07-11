export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELED"
  | "COMPLETED";
export type PaymentStatus = "PENDING" | "PAID" | "REFUNDED" | "PARTIALLY_PAID";
export type PaymentMethod =
  | "A VISTA"
  | "CARTÃO DE CRÉDITO"
  | "CARTÃO DE DÉBITO"
  | "PIX"
  | "BOLETO";

export type AppointmentResponse = {
  total: number;
  totalPages: number;
  currentPage: number;
  appointments: Appointment[];
};

export type Appointment = {
  id: string;
  userId: string;
  salonId: string;
  status: AppointmentStatus;
  scheduledAt: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  services: {
    id: string;
    appointmentId: string;
    serviceId: string;
    professionalId: string;
    service: {
      id: string;
      name: string;
      description: string;
      price: number;
      duration: number;
      imageUrl: string;
      categoryId: string;
      salonId: string;
      createdAt: string;
      updatedAt: string;
    };
    professional: {
      id: string;
      name: string;
      bio: string;
      avatarUrl: string;
      email: string;
      phone: string;
      createdAt: string;
      updatedAt: string;
      salonId: string;
    };
  }[];
  payment: {
    id: string;
    appointmentId: string;
    amount: number;
    method: PaymentMethod;
    status: PaymentStatus;
    createdAt: string;
  };
};
