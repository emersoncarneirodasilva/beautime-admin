import { UserType } from "@/types";

type FetchUsersParams = {
  token: string;
  page?: number;
  limit?: number;
  search?: string;
};

type FetchUsersResponse = {
  users: UserType[];
  total: number;
  totalPages: number;
  currentPage: number;
};

export default async function fetchUsers({
  token,
  page = 1,
  limit = 10,
  search = "",
}: FetchUsersParams): Promise<FetchUsersResponse> {
  const query = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search,
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users?${query.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { tags: ["users"] },
    }
  );

  if (!res.ok) {
    throw new Error("Falha ao buscar usuários");
  }

  return res.json();
}
