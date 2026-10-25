"use client";

import { useState } from "react";
import { UserType } from "@/types";
import UserModal from "./UserModal";

interface UserSelectorProps {
  token: string;
  onSelectUser: (userId: string) => void;
}

export default function UserSelector({
  token,
  onSelectUser,
}: UserSelectorProps) {
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (user: UserType) => {
    setSelectedUser(user);
    onSelectUser(user.id);
    setIsOpen(false);
  };

  return (
    <section className="space-y-6">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="ui-button ui-button--secondary"
      >
        {selectedUser ? "Alterar usuário" : "Selecionar usuário"}
      </button>

      {selectedUser && (
        <div className="mt-4 rounded-xl border border-[var(--color-gray-medium)] bg-[var(--color-white)] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
            Cliente selecionado
          </p>
          <p className="mt-1 font-semibold text-[var(--foreground)]">
            {selectedUser.name}
          </p>
          <p className="text-sm text-[var(--text-secondary)]">
            {selectedUser.email}
          </p>
        </div>
      )}

      {isOpen && (
        <UserModal
          token={token}
          onClose={() => setIsOpen(false)}
          onSelect={handleSelect}
        />
      )}
    </section>
  );
}
