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
        onClick={() => setIsOpen(true)}
        className="px-5 py-2.5 rounded-md bg-[var(--color-action)] text-[var(--text-on-action)] hover:bg-[var(--color-action-hover)] cursor-pointer transition-colors"
      >
        Selecionar Usuário
      </button>

      {selectedUser && (
        <div className="p-4 rounded-lg shadow-sm border bg-[var(--color-white)] border-[var(--color-gray-light)]">
          <p className="font-semibold">{selectedUser.name}</p>
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
