import { createUser } from "./actions/createUser";

interface Params {
  slug: string;
}

export default async function CreateUserPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Criar Usuário</h1>
      <form action={createUser}>
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
            type="number"
            id="phone"
            name="phone"
            required
            className="w-full p-2 border border-gray-300 rounded appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Senha
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 hover:cursor-pointer transition duration-200"
        >
          Criar Usuário
        </button>
      </form>
    </div>
  );
}
