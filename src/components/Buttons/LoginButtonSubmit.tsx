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
      className="ui-button ui-button--primary w-full"
    >
      {pending ? <span className="animate-pulse">Carregando...</span> : title}
    </button>
  );
}
