export type ProfessionalService = {
  id: string;
  serviceId: string;
  professionalId: string;
};

export type ProfessionalType = {
  id: string;
  name: string;
  bio: string;
  avatarUrl: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  salonId: string;
  services: ProfessionalService[];
  images: string[]; // ou outro tipo, se necessário
};
