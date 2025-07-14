"use client";

import { useRef } from "react";
import { deleteProfessional } from "@/app/[slug]/dashboard/professionals/[id]/actions/deleteProfessional";

interface Props {
  slug: string;
  id: string;
}

export default function DeleteProfessionalButton({ slug, id }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Tem certeza que deseja deletar este profissional?"
    );

    if (confirmed) {
      formRef.current?.requestSubmit();
    }
  };

  return (
    <form ref={formRef} action={deleteProfessional}>
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="id" value={id} />

      <button
        type="button"
        onClick={handleDelete}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 hover:cursor-pointer"
      >
        Deletar Profissional
      </button>
    </form>
  );
}
