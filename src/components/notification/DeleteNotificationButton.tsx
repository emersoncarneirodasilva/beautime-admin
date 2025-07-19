"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteNotification } from "@/libs/api/deleteNotification";

interface DeleteNotificationButtonProps {
  notificationId: string;
  slug: string;
  token: string;
  onDeleted?: () => void;
}

export default function DeleteNotificationButton({
  notificationId,
  slug,
  token,
  onDeleted,
}: DeleteNotificationButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir esta notificação?")) return;

    setLoading(true);

    try {
      await deleteNotification(notificationId, token);

      if (onDeleted) {
        onDeleted();
      } else {
        router.push(`/${slug}/dashboard/notifications`);
      }
    } catch (error: any) {
      alert(`Falha ao excluir notificação: ${error.message}`);
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="flex items-center gap-1 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 hover:cursor-pointer transition disabled:opacity-50"
    >
      🗑️ {loading ? "Excluindo..." : "Excluir"}
    </button>
  );
}
