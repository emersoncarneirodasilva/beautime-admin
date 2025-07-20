"use client";

import Link from "next/link";
import RoleToggleButton from "@/components/User/RoleToggleButton";
import { useRouter } from "next/navigation";
import { UserType } from "@/types";
import { useSalon } from "@/context/SalonContext";
import { deleteUser } from "@/libs/api/deleteUser";
import { getUserIdFromToken } from "@/utils/getUserIdFromToken";

interface Props {
  user: UserType;
  token: string;
  slug: string;
}

export default function UserDetails({ user, token, slug }: Props) {
  const salon = useSalon();
  const router = useRouter();
  const loggedUserId = getUserIdFromToken(token);
  const isOwner = loggedUserId === salon.createdBy;

  const handleDelete = async () => {
    const confirm = window.confirm(
      "Tem certeza que deseja excluir este usuário?"
    );
    if (!confirm) return;

    try {
      await deleteUser(user.id, token);
      router.push(`/${slug}/dashboard/users`);
    } catch (error) {
      alert((error as Error).message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-zinc-900 text-zinc-100 p-6 rounded-2xl shadow-lg">
      <h1 className="text-3xl font-semibold mb-6 border-b border-zinc-700 pb-3">
        Detalhes do Usuário
      </h1>

      <ul className="space-y-3 text-lg">
        <li>
          <span className="text-zinc-400">ID:</span> {user.id}
        </li>
        <li>
          <span className="text-zinc-400">Nome:</span> {user.name}
        </li>
        <li>
          <span className="text-zinc-400">Telefone:</span>{" "}
          {user.phone || "Não informado"}
        </li>
        <li>
          <span className="text-zinc-400">Email:</span> {user.email}
        </li>
        <li>
          <span className="text-zinc-400">Função:</span>{" "}
          {salon.createdBy === user.id
            ? "Dono"
            : user.role === "ADMIN"
            ? "Administrador"
            : "Usuário"}
        </li>
      </ul>

      {isOwner && user.id !== loggedUserId && (
        <div className="mt-6 flex flex-wrap gap-4 items-center">
          <RoleToggleButton
            userId={user.id}
            initialRole={user.role}
            token={token}
          />

          <button
            onClick={handleDelete}
            className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 hover:cursor-pointer transition"
          >
            Excluir Usuário
          </button>
        </div>
      )}

      <div className="mt-10 flex flex-wrap gap-4">
        <Link href={`/${slug}/dashboard/users`}>
          <button className="px-6 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 hover:cursor-pointer transition">
            Voltar
          </button>
        </Link>

        <Link href={`/${slug}/dashboard/users/${user.id}/edit`}>
          <button className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 hover:cursor-pointer transition">
            Atualizar
          </button>
        </Link>

        <Link href={`/${slug}/dashboard/notifications/create/${user.id}`}>
          <button className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 hover:cursor-pointer transition">
            Criar Notificação
          </button>
        </Link>
      </div>
    </div>
  );
}
