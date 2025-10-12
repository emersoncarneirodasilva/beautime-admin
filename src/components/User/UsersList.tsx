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
      <p
        className="grid place-content-center h-[60vh] text-[var(--text-secondary)] text-base"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        Nenhum usuário encontrado.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((user) => {
        const roleLabel =
          salon.createdBy === user.id
            ? "Dono"
            : user.role === "ADMIN"
            ? "Administrador"
            : "Usuário";

        return (
          <li
            key={user.id}
            className="flex flex-col p-5 rounded-xl border border-[var(--color-gray-medium)] transition-all hover:shadow-md bg-[var(--color-white)] dark:bg-[var(--color-gray-light)]"
          >
            <div className="flex flex-col gap-2">
              <p
                className="font-semibold text-lg"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                {user.name}
              </p>
              <p
                className="text-sm break-all"
                style={{ color: "var(--text-secondary)" }}
              >
                {user.email}
              </p>
              <p className="text-sm italic">
                Cargo:{" "}
                <span
                  style={{
                    color:
                      roleLabel === "Dono"
                        ? "var(--color-secondary)"
                        : roleLabel === "Administrador"
                        ? "var(--color-primary)"
                        : "var(--text-secondary)",
                    fontWeight: 500,
                  }}
                >
                  {roleLabel}
                </span>
              </p>
            </div>

            <div className="mt-4">
              <Link
                href={`/${slug}/dashboard/users/${user.id}`}
                className="text-[var(--color-primary)] font-medium hover:underline text-sm"
              >
                Ver detalhes →
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
