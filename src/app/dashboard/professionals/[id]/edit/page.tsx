import { fetchProfessionalById } from "@/libs/api/fetchProfessionalById";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { updateProfessional } from "./actions/updateProfessional";
import AccessDenied from "@/components/Auth/AccessDenied";
import ErrorSection from "@/components/Error/ErrorSection";

type Params = Promise<{ id: string }>;

export default async function EditProfessionalPage({
  params,
}: {
  params: Params;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { id } = await params;

  let professional;

  try {
    professional = await fetchProfessionalById(id, token);
  } catch (error) {
    return (
      <ErrorSection
        title="Erro ao carregar dados"
        message={(error as Error).message}
        linkHref="/dashboard/professionals"
        linkText="Voltar à lista de profissionais"
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Editar Profissional</h1>
      <form action={updateProfessional}>
        <input type="hidden" name="id" value={professional.id} />

        <div className="mb-4">
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            name="name"
            defaultValue={professional.name}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            name="email"
            defaultValue={professional.email}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="phone">Telefone</label>
          <input
            id="phone"
            name="phone"
            defaultValue={professional.phone || ""}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="bio">Biografia</label>
          <textarea
            id="bio"
            name="bio"
            defaultValue={professional.bio || ""}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="avatarUrl">URL do Avatar</label>
          <input
            id="avatarUrl"
            name="avatarUrl"
            defaultValue={professional.avatarUrl || ""}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 hover:cursor-pointer transition"
        >
          Atualizar Profissional
        </button>
      </form>
    </div>
  );
}
