import { ServiceProfessional } from "@/types";

type FetchServicesOnProfessionalsParams = {
  token: string;
  page?: number;
  limit?: number;
  search?: string;
};

type FetchServicesOnProfessionalsResponse = {
  servicesOnProfessional: ServiceProfessional[];
  total: number;
  totalPages: number;
  currentPage: number;
};

export default async function fetchServicesOnProfessionals({
  token,
  page = 1,
  limit = 10,
  search = "",
}: FetchServicesOnProfessionalsParams): Promise<FetchServicesOnProfessionalsResponse> {
  const query = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search,
  });

  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL
    }/services-on-professionals?${query.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Falha ao buscar serviços vinculados com profissionais");
  }

  return res.json();
}
