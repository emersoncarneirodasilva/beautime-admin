// src/app/[slug]/dashboard/users/page.tsx

import Link from "next/link";
import fetchUsers from "@/libs/api/fetchUsers";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import AccessDenied from "@/components/Auth/AccessDenied";
import ErrorSection from "@/components/Error/ErrorSection";
import UsersList from "@/components/User/UsersList";
import { UserType } from "@/types";

interface Params {
  slug: string;
}

interface SearchParams {
  page?: string;
  limit?: string;
  search?: string;
}

export default async function UsersPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams?: SearchParams;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug } = params;

  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 10;
  const search = searchParams?.search || "";

  let usersData;

  try {
    usersData = await fetchUsers({ token, page, limit, search });
  } catch (error) {
    return (
      <ErrorSection
        title="Erro ao carregar usuários"
        message={(error as Error).message}
        linkHref={`/${slug}/dashboard`}
        linkText="Voltar ao painel"
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Usuários</h1>
        <Link
          href={`/${slug}/dashboard`}
          className="text-blue-600 hover:underline text-sm"
        >
          ← Voltar ao painel
        </Link>
      </div>

      {/* Formulário de busca */}
      <form method="GET" className="flex gap-3 mb-6">
        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Buscar usuários..."
          className="flex-grow border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          name="limit"
          defaultValue={limit.toString()}
          className="border border-gray-300 bg-black rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="5">5 por página</option>
          <option value="10">10 por página</option>
          <option value="20">20 por página</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 hover:cursor-pointer transition"
        >
          Buscar
        </button>
      </form>

      <UsersList users={usersData.users} slug={slug} />

      {/* Paginação */}
      <div className="flex justify-between items-center mt-8">
        <Link
          href={`?page=${page - 1}&limit=${limit}&search=${encodeURIComponent(
            search
          )}`}
          className={`px-4 py-2 rounded ${
            page <= 1
              ? "bg-gray-300 cursor-not-allowed text-gray-500"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          aria-disabled={page <= 1}
        >
          Anterior
        </Link>

        <span className="text-gray-700">
          Página {usersData.currentPage} de {usersData.totalPages}
        </span>

        <Link
          href={`?page=${page + 1}&limit=${limit}&search=${encodeURIComponent(
            search
          )}`}
          className={`px-4 py-2 rounded ${
            page >= usersData.totalPages
              ? "bg-gray-300 cursor-not-allowed text-gray-500"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          aria-disabled={page >= usersData.totalPages}
        >
          Próxima
        </Link>
      </div>
    </div>
  );
}
