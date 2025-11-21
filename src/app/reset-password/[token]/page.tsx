interface Params {
  token: string;
}

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { token } = await params;

  return (
    <div>
      <h1>Redefinir Senha</h1>

      <h2>Token: {token}</h2>

      <form className="w-full space-y-4">
        <input
          type="password"
          name="new-password"
          placeholder="Nova senha"
          required
          className="border border-[var(--color-gray-medium)] dark:border-[var(--color-gray-border)] rounded-lg px-4 py-3 w-full bg-[var(--color-white)] dark:bg-[var(--color-gray-light)] text-[var(--foreground)] placeholder:text-[var(--color-gray-medium)] dark:placeholder:text-[var(--color-gray-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
        />
        <input
          type="password"
          name="confirm-password"
          placeholder="Confirme a nova senha"
          required
          className="border border-[var(--color-gray-medium)] dark:border-[var(--color-gray-border)] rounded-lg px-4 py-3 w-full bg-[var(--color-white)] dark:bg-[var(--color-gray-light)] text-[var(--foreground)] placeholder:text-[var(--color-gray-medium)] dark:placeholder:text-[var(--color-gray-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
        />

        <button
          type="submit"
          className="w-full py-3 sm:py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold rounded-lg transition-colors text-base sm:text-lg cursor-pointer"
        >
          Redefinir Senha
        </button>
      </form>
    </div>
  );
}
