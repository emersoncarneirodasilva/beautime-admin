export type ImageType = {
  id: string;
  url: string;
  title?: string;
  description?: string;
  type: "salon" | "professional" | "service";
  uploadedAt: string;
  salonId: string;
  professionalId: string | null;
  serviceId: string | null;
};
