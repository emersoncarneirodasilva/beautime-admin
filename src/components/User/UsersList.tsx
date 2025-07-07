"use client";

import Link from "next/link";
import { UserType } from "@/types";
import { useSalon } from "@/context/SalonContext";

type Props = {
  users: UserType[];
};

export default function UsersList({ users }: Props) {
  const salon = useSalon();

  if (users.length === 0) {
    return (
      <p className="grid place-content-center h-[70vh] text-gray-500">
        Nenhum usuário encontrado.
      </p>
    );
  }

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id} className="border-b py-2">
          <strong>{user.name}</strong> — {user.email} —{" "}
          <em>
            {salon.createdBy === user.id
              ? "DONO"
              : user.role === "ADMIN"
              ? "ADMINISTRADOR"
              : "USUÁRIO"}{" "}
            —{" "}
            <Link
              href={`/dashboard/users/${user.id}`}
              className="hover:text-blue-500 hover:cursor-pointer duration-200"
            >
              Ver detalhes
            </Link>
          </em>
        </li>
      ))}
    </ul>
  );
}
