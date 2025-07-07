import fetchUserById from "@/libs/api/fetchUserById";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import AccessDenied from "@/components/Auth/AccessDenied";
import ErrorSection from "@/components/Error/ErrorSection";
import UserDetails from "@/components/User/UserDetails";

export default async function UserPage({ params }: { params: { id: string } }) {
  let token: string;

  try {
    token = await verifyAdminAuth();
  } catch {
    return <AccessDenied />;
  }

  let user;

  try {
    user = await fetchUserById(params.id, token);
  } catch (error) {
    return (
      <ErrorSection
        title="Erro ao carregar dados do usuário"
        message={(error as Error).message}
        linkHref="/dashboard/users"
        linkText="Voltar à lista de usuários"
      />
    );
  }

  return <UserDetails user={user} token={token} />;
}
