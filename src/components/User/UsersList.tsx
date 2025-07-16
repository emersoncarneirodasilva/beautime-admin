"use client";

import Link from "next/link";
import { UserType } from "@/types";
import { useSalon } from "@/context/SalonContext";

type Props = {
  users: UserType[];
  slug: string;
};

export default function UsersList({ users, slug }: Props) {
  const salon = useSalon();

  if (users.length === 0) {
    return (
      <p className="grid place-content-center h-[70vh] text-gray-500">
        Nenhum usuário encontrado.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="border rounded-lg p-4 shadow-sm hover:shadow-md transition flex justify-between items-center"
        >
          <div>
            <p className="font-semibold text-lg">{user.name}</p>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500">
              Cargo:{" "}
              {salon.createdBy === user.id
                ? "Dono"
                : user.role === "ADMIN"
                ? "Administrador"
                : "Usuário"}
            </p>
          </div>
          <Link
            href={`/${slug}/dashboard/users/${user.id}`}
            className="text-blue-600 hover:underline"
          >
            Ver Detalhes
          </Link>
        </div>
      ))}
    </div>
  );
}
