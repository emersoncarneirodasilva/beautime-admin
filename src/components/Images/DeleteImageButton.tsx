"use client";

import { useState } from "react";
import { deleteImageById } from "@/libs/api/deleteImageById";
import ConfirmDialogModal from "../Modal/ConfirmDialogModal";

type Props = {
  id: string;
  token: string;
  onDelete?: () => void;
};

export function DeleteImageButton({ id, token, onDelete }: Props) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      await deleteImageById(id, token);
      onDelete?.();
    } catch (err) {
      alert("Erro ao excluir imagem.");
      console.error(err);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={loading}
        className="text-red-500 hover:underline disabled:opacity-50 hover:cursor-pointer"
      >
        {loading ? "Excluindo..." : "Excluir"}
      </button>

      <ConfirmDialogModal
        open={open}
        title="Confirmar exclusão"
        description="Tem certeza que deseja excluir esta imagem?"
        confirmText={loading ? "Excluindo..." : "Excluir"}
        onConfirm={handleConfirm}
        onClose={() => !loading && setOpen(false)}
      />
    </>
  );
}
