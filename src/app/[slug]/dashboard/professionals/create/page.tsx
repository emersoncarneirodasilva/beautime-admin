import { createProfessional } from "./actions/createProfessional";

interface Params {
  slug: string;
}

export default async function CreateProfessionalPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cadastrar Profissional</h1>
      <form action={createProfessional}>
        <input type="hidden" name="slug" value={slug} />

        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Nome
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            E-mail
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium mb-2">
            Telefone
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="bio" className="block text-sm font-medium mb-2">
            Biografia
          </label>
          <textarea
            id="bio"
            name="bio"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="avatarUrl" className="block text-sm font-medium mb-2">
            URL do Avatar
          </label>
          <input
            type="url"
            id="avatarUrl"
            name="avatarUrl"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 hover:cursor-pointer transition duration-200"
        >
          Cadastrar Profissional
        </button>
      </form>
    </div>
  );
}
