import { Service } from "@/types";

interface GetServicesResponse {
  total: number;
  totalPages: number;
  currentPage: number;
  services: Service[];
}

export async function fetchServices(
  token: string,
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<GetServicesResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) {
    params.append("search", search);
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/services?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { tags: ["services"] },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch services");
  }

  return res.json();
}
