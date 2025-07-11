export type NotificationType = {
  id: string;
  appointmentId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  appointment: {
    id: string;
    userId: string;
    salonId: string;
    status: "PENDING" | "CONFIRMED" | "CANCELED" | "COMPLETED";
    scheduledAt: string;
    createdAt: string;
    updatedAt: string;
  };
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
