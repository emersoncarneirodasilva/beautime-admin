export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // em minutos
  imageUrl?: string | null; // pode ser string, null ou até ausente
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  categoryId: string;
  salonId: string;
  category?: {
    name: string;
  };
}
