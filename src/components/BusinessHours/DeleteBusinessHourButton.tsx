"use client";

import { deleteBusinessHour } from "@/libs/api/deleteBusinessHour";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  id: string;
  token: string;
};

export function DeleteBusinessHourButton({ id, token }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmDelete = confirm(
      "Tem certeza que deseja excluir este horário?"
    );
    if (!confirmDelete) return;

    setLoading(true);

    try {
      await deleteBusinessHour(id, token);

      router.refresh();
    } catch (err) {
      alert("Erro ao excluir horário.");
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
