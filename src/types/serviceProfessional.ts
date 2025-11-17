type Professional = {
  id: string;
  name: string;
  bio: string | null;
  avatarUrl: string | null;
  email: string;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
  salonId: string;
};

type Service = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  salonId: string;
};

export type ServiceProfessional = {
  id: string;
  serviceId: string;
  professionalId: string;
  professional: Professional;
  service: Service;
};
