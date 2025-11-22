"use client";

import { useFormStatus } from "react-dom";

type LoginButtonSubmitProps = {
  title: string;
  id?: string;
};

export default function LoginButtonSubmit({
  title,
  id,
}: LoginButtonSubmitProps) {
  const { pending } = useFormStatus();

  return (
    <button
      id={id}
      type="submit"
      disabled={pending}
      className="w-full py-3 sm:py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold rounded-lg transition-colors text-base sm:text-lg cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {pending ? <span className="animate-pulse">Carregando...</span> : title}
    </button>
  );
}
