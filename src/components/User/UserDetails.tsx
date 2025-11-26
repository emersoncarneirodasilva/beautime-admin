"use client";

import { useState } from "react";
import { UserType } from "@/types";
import { useSalon } from "@/context/SalonContext";
import { getUserIdFromToken } from "@/utils/getUserIdFromToken";
import BackLink from "../Buttons/BackLink";
import RoleToggleButton from "./RoleToggleButton";
import ActionButton from "../Buttons/ActionButton";
import DeleteButton from "../Buttons/DeleteButton";

import { Pencil, Bell, Trash2 } from "lucide-react";
import { deleteUserAction } from "@/app/[slug]/dashboard/users/[id]/actions/deleteUserAction";

interface Props {
  user: UserType;
  token: string;
  slug: string;
}

export default function UserDetails({ user, token, slug }: Props) {
  const salon = useSalon();
  const loggedUserId = getUserIdFromToken(token);
  const isOwner = loggedUserId === salon.createdBy;

  const [actionError, setActionError] = useState<string | null>(null);

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-10 space-y-8">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">
          Detalhes do Usuário
        </h1>
        <p className="text-[var(--text-secondary)] text-base">
          Visualize as informações completas e gerencie o usuário selecionado.
        </p>
      </header>

      {/* Card */}
      <div className="bg-[var(--color-white)] dark:bg-[var(--color-gray-light)] border border-[var(--color-gray-medium)] rounded-2xl shadow-lg p-8 transition-colors duration-300 hover:shadow-xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-base">
          {[
            { label: "Nome", value: user.name },
            { label: "E-mail", value: user.email },
            { label: "Telefone", value: user.phone || "Não informado" },
            {
              label: "Cargo",
              value:
                salon.createdBy === user.id
                  ? "Dono"
                  : user.role === "ADMIN"
                  ? "Administrador"
                  : "Usuário",
            },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-[var(--foreground)] font-semibold mb-1">
                {item.label}
              </p>
              <p className="text-[var(--text-secondary)] font-medium">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Ações */}
        <div className="pt-6 space-y-4 border-t border-gray-200 dark:border-gray-700">
          {isOwner && user.id !== loggedUserId ? (
            <>
              <RoleToggleButton
                userId={user.id}
                initialRole={user.role}
                token={token}
              />

              {actionError && (
                <p className="text-red-600 font-medium animate-fadeIn">
                  {actionError}
                </p>
              )}

              <div className="flex flex-wrap gap-4 pt-2">
                <ActionButton
                  href={`/${slug}/dashboard/users/${user.id}/edit`}
                  text={
                    <span className="flex items-center gap-2">
                      <Pencil className="w-4 h-4" />
                      Atualizar
                    </span>
                  }
                  className="shadow-sm"
                />

                <ActionButton
                  href={`/${slug}/dashboard/notifications/create/${user.id}`}
                  text={
                    <span className="flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      Criar Notificação
                    </span>
                  }
                  className="text-[var(--text-on-action)] bg-sky-600 hover:bg-sky-700 shadow-sm"
                />

                <form
                  id="delete-user-form"
                  action={async () => {
                    try {
                      await deleteUserAction(user.id, token, slug);
                    } catch (error) {
                      setActionError((error as Error).message);
                    }
                  }}
                >
                  <DeleteButton
                    formId="delete-user-form"
                    text={
                      <span className="flex items-center gap-2">
                        <Trash2 className="w-4 h-4" />
                        Excluir
                      </span>
                    }
                    confirmMessage={`Tem certeza que deseja excluir o usuário "${user.name}"?`}
                    className="px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 text-[var(--text-on-action)] bg-[var(--color-error)] hover:bg-[#c53030] shadow-sm cursor-pointer transition-all duration-200"
                  />
                </form>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-wrap gap-4 pt-2">
                <ActionButton
                  href={`/${slug}/dashboard/users/${user.id}/edit`}
                  text={
                    <span className="flex items-center gap-2">
                      <Pencil className="w-4 h-4" />
                      Atualizar
                    </span>
                  }
                  className="text-[var(--text-on-action)] bg-[var(--color-action)] hover:bg-[var(--color-action-hover)] shadow-sm"
                />

                <ActionButton
                  href={`/${slug}/dashboard/notifications/create/${user.id}`}
                  text={
                    <span className="flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      Criar Notificação
                    </span>
                  }
                  className="text-[var(--text-on-action)] bg-sky-600 hover:bg-sky-700 shadow-sm"
                />
              </div>
            </>
          )}
        </div>
      </div>

      <footer className="mt-6">
        <BackLink slug={slug} to="dashboard/users" />
      </footer>
    </section>
  );
}
