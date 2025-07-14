import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchProfessionals } from "@/libs/api/fetchProfessionals";
import { fetchServices } from "@/libs/api/fetchServices";
import AccessDenied from "@/components/Auth/AccessDenied";
import { createImage } from "./actions/createImage";

interface Params {
  slug: string;
}

export default async function UploadImagePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug } = await params;

  const [professionals, services] = await Promise.all([
    fetchProfessionals(token),
    fetchServices(token),
  ]);

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 space-y-6">
      <h1 className="text-2xl font-bold">📤 Enviar Imagem</h1>

      <form action={createImage} className="space-y-4">
        <input type="hidden" name="slug" value={slug} />

        <div>
          <label className="block text-sm mb-1">URL da Imagem</label>
          <input
            type="url"
            name="url"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Descrição (tipo)</label>
          <input
            type="text"
            name="type"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Tipo de imagem</label>
          <select
            name="target"
            required
            className="w-full border rounded px-3 py-2 bg-black"
          >
            <option value="">Selecione</option>
            <option value="salon">Imagem do Salão</option>
            <option value="professional">Imagem de Profissional</option>
            <option value="service">Imagem de Serviço</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">
            Profissional (se aplicável)
          </label>
          <select
            name="professionalId"
            className="w-full border rounded px-3 py-2 bg-black"
          >
            <option value="">Nenhum</option>
            {professionals.map((professional: { id: string; name: string }) => (
              <option key={professional.id} value={professional.id}>
                {professional.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Serviço (se aplicável)</label>
          <select
            name="serviceId"
            className="w-full border rounded px-3 py-2 bg-black"
          >
            <option value="">Nenhum</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 hover:cursor-pointer transition"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
