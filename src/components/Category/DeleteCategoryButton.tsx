"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCategory } from "@/libs/api/deleteCategory";

type Props = {
  id: string;
  token: string;
};

export default function DeleteCategoryButton({ id, token }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir esta categoria?"
    );
    if (!confirmed) return;

    try {
      await deleteCategory(id, token);

      router.refresh();
    } catch (err) {
      alert("Erro inesperado.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      title="Excluir categoria"
      className="hover:cursor-pointer"
    >
      🗑️
    </button>
  );
}
