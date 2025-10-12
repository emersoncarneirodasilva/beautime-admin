"use client";

import { useState } from "react";
import { deleteImageById } from "@/libs/api/deleteImageById";

type Props = {
  id: string;
  token: string;
  onDelete?: () => void;
};

export function DeleteImageButton({ id, token, onDelete }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = confirm("Tem certeza que deseja excluir esta imagem?");
    if (!confirmed) return;

    setLoading(true);

    try {
      await deleteImageById(id, token);
      onDelete?.();
    } catch (err) {
      alert("Erro ao excluir imagem.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-500 hover:underline disabled:opacity-50 hover:cursor-pointer"
    >
      {loading ? "Excluindo..." : "Excluir"}
    </button>
  );
}
