"use client";

import { useState } from "react";
import {
  promoteUserClient,
  demoteUserClient,
} from "@/libs/api/userRoleActionsClient";
import { RoleToggleButtonProps } from "@/types";

export default function RoleToggleButton({
  userId,
  initialRole,
  token,
}: RoleToggleButtonProps) {
  const [role, setRole] = useState(initialRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handlePromote() {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await promoteUserClient(userId, token);
      setRole("ADMIN");
      setSuccess("Usuário promovido com sucesso!");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDemote() {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await demoteUserClient(userId, token);
      setRole("USER");
      setSuccess("Usuário rebaixado com sucesso!");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {role === "USER" && (
        <button
          onClick={handlePromote}
          disabled={loading}
          className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 hover:cursor-pointer"
        >
          {loading ? "Promovendo..." : "Promover a Admin"}
        </button>
      )}

      {role === "ADMIN" && (
        <button
          onClick={handleDemote}
          disabled={loading}
          className="mt-6 bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700 hover:cursor-pointer"
        >
          {loading ? "Rebaixando..." : "Rebaixar para Usuário"}
        </button>
      )}

      {error && <p className="mt-2 text-red-600">Erro: {error}</p>}
      {success && <p className="mt-2 text-green-600">{success}</p>}
    </div>
  );
}
