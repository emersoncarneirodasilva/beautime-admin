import fetchUserById from "@/libs/api/fetchUserById";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import AccessDenied from "@/components/Auth/AccessDenied";
import ErrorSection from "@/components/Error/ErrorSection";
import UserDetails from "@/components/User/UserDetails";
import { UserType } from "@/types";
import { Metadata } from "next";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";

interface Params {
  slug: string;
  id: string;
}

// Metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const token = await verifyAdminAuth();
  const { id } = await params;

  if (!token) return { title: "Acesso negado" };

  const salon = await fetchSalonByAdmin(token);

  const user = await fetchUserById(id, token);

  return {
    title: `Beautime Admin - ${salon.name} - ${user.name}`,
    description: `Detalhes do usuário associado ao salão ${salon.name}.`,
  };
}

export default async function UserPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug } = await params;
  const { id } = await params;

  let user: UserType;

  try {
    user = await fetchUserById(id, token);
  } catch (error) {
    return (
      <ErrorSection
        title="Erro ao carregar dados do usuário"
        message={(error as Error).message}
        linkHref={`/${slug}/dashboard/users`}
        linkText="Voltar à lista de usuários"
      />
    );
  }

  return <UserDetails user={user} token={token} slug={slug} />;
}
