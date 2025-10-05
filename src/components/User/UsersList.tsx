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
    <div className="flex flex-col gap-4">
      {users.map((user) => {
        const roleLabel =
          salon.createdBy === user.id
            ? "Dono"
            : user.role === "ADMIN"
            ? "Administrador"
            : "Usuário";

        return (
          <div
            key={user.id}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-5 rounded-xl border transition-all hover:shadow-md"
            style={{
              backgroundColor: "var(--color-white)",
              borderColor: "var(--color-gray-medium)",
              color: "var(--foreground)",
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            <div className="flex flex-col text-sm sm:text-base">
              <p
                className="font-semibold text-lg mb-1"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                {user.name}
              </p>
              <p
                className="text-sm mb-1 break-all"
                style={{ color: "var(--text-secondary)" }}
              >
                {user.email}
              </p>
              <p
                className="text-sm italic"
                style={{ color: "var(--text-secondary)" }}
              >
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

            <div className="flex justify-start sm:justify-end">
              <Link
                href={`/${slug}/dashboard/users/${user.id}`}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto text-center"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "var(--text-on-action)",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.backgroundColor =
                    "var(--color-primary-hover)")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.backgroundColor =
                    "var(--color-primary)")
                }
              >
                Ver Detalhes
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
