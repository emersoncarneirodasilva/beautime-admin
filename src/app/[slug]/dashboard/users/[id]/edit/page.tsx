import fetchUserById from "@/libs/api/fetchUserById";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import AccessDenied from "@/components/Auth/AccessDenied";
import { UserType } from "@/types";
import ErrorSection from "@/components/Error/ErrorSection";
import { updateUser } from "./actions/updateUser";

interface Params {
  slug: string;
  id: string;
}

export default async function EditUserPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug, id } = await params;

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

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
      <form
        action={updateUser}
        className="bg-zinc-800 shadow-lg rounded-2xl p-8 w-full max-w-md space-y-6 text-white"
      >
        <input type="hidden" name="token" value={token} />
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="id" value={user.id} />

        <h2 className="text-2xl font-bold text-center text-white">
          Editar Usuário
        </h2>

        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm text-zinc-300">
            Nome:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={user.name ?? ""}
            className="p-2 bg-zinc-700 border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Digite o nome"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className="text-sm text-zinc-300">
            Telefone:
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            defaultValue={user.phone ?? ""}
            className="p-2 bg-zinc-700 border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Digite o telefone"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 hover:cursor-pointer transition"
        >
          Atualizar
        </button>
      </form>
    </div>
  );
}
