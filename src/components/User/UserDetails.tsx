"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserType } from "@/types";
import { useSalon } from "@/context/SalonContext";
import RoleToggleButton from "@/components/User/RoleToggleButton";
import { deleteUser } from "@/libs/api/deleteUser";
import { getUserIdFromToken } from "@/utils/getUserIdFromToken";

type Props = {
  user: UserType;
  token: string;
};

export default function UserDetails({ user, token }: Props) {
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
      router.push("/dashboard/users");
    } catch (error) {
      alert((error as Error).message);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detalhes do Usuário</h1>
      <ul className="space-y-2">
        <li>
          <strong>ID:</strong> {user.id}
        </li>
        <li>
          <strong>Nome:</strong> {user.name}
        </li>
        <li>
          <strong>Telefone:</strong> {user.phone || "Não informado"}
        </li>
        <li>
          <strong>Email:</strong> {user.email}
        </li>
        <li>
          <strong>Função:</strong>{" "}
          {salon.createdBy === user.id
            ? "Dono"
            : user.role === "ADMIN"
            ? "Administrador"
            : "Usuário"}
        </li>
      </ul>

      {isOwner && user.id !== loggedUserId && (
        <div className="flex items-center gap-4">
          <RoleToggleButton
            userId={user.id}
            initialRole={user.role}
            token={token}
          />

          <button
            onClick={handleDelete}
            className="mt-6 px-6 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 hover:cursor-pointer transition"
          >
            Excluir Usuário
          </button>
        </div>
      )}

      <Link href="/dashboard/users">
        <button className="px-6 py-2 mt-8 rounded-md bg-blue-500 text-white hover:bg-blue-600 hover:cursor-pointer transition">
          Voltar
        </button>
      </Link>
    </div>
  );
}
