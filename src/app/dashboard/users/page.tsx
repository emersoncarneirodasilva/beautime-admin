import Link from "next/link";
import fetchUsers from "@/libs/api/fetchUsers";
import { UserType } from "@/types";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import AccessDenied from "@/components/Auth/AccessDenied";
import ErrorSection from "@/components/Error/ErrorSection";
import UsersList from "@/components/User/UsersList";

export default async function UsersPage() {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  let users: UserType[] = [];

  try {
    users = await fetchUsers(token);
  } catch (error) {
    return (
      <ErrorSection
        title="Erro ao carregar usuários"
        message={(error as Error).message}
        linkHref="/dashboard"
        linkText="Voltar ao painel"
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Usuários</h1>
      <UsersList users={users} />

      <div className="flex items-center justify-between mt-4">
        <Link href="/dashboard">
          <p className="hover:text-blue-500 hover:cursor-pointer hover:underline duration-200">
            Voltar
          </p>
        </Link>
        <Link
          href="/dashboard/users/create"
          className="hover:text-blue-500 hover:cursor-pointer hover:underline duration-200"
        >
          Criar Usuário
        </Link>
      </div>
    </div>
  );
}
