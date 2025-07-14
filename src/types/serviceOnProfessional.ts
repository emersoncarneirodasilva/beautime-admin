import { Service } from "./service";

export type ServiceOnProfessional = {
  id: string;
  serviceId: string;
  professionalId: string;
  service: Service;
};
