import { handleLogin } from "./actions/handleLogin";

export default function LoginPage() {
  return (
    <main className="max-w-md mx-auto mt-20 p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Entrar no Beautime</h1>

      <form action={handleLogin} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          required
          className="border p-2 w-full rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Senha"
          required
          className="border p-2 w-full rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 hover:cursor-pointer transition"
        >
          Entrar
        </button>
      </form>
    </main>
  );
}
