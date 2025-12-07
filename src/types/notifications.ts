export type SnapshotService = {
  price: number;
  duration: number;
  serviceId: string;
  serviceName: string;
  professionalId: string;
  professionalName: string;
};

export type SnapshotData = {
  user?: {
    name: string;
  };
  services?: SnapshotService[];
  changedBy?: string;
  afterStatus?: "PENDING" | "CONFIRMED" | "CANCELED" | "COMPLETED";
  beforeStatus?: "PENDING" | "CONFIRMED" | "CANCELED" | "COMPLETED";
  afterScheduledAt?: string;
  beforeScheduledAt?: string;
};

export type SnapshotType = {
  id: string;
  appointmentId: string | null;
  data: SnapshotData;
  createdAt: string;
};

export type AppointmentType = {
  id: string;
  userId: string;
  salonId: string;
  status: "PENDING" | "CONFIRMED" | "CANCELED" | "COMPLETED";
  scheduledAt: string;
  createdAt: string;
  updatedAt: string;
};

export type NotificationType = {
  id: string;
  appointmentId: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
  appointment: AppointmentType | null;
  snapshot: SnapshotType;
};

export type NotificationsResponse = {
  message: string;
  notifications: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    data: NotificationType[];
  };
};
