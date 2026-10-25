"use client";
import { useEffect, useState } from "react";
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

  const handlePromote = async () => {
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
  };

  const handleDemote = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await demoteUserClient(userId, token);
      setRole("USER");
      setSuccess("Status revogado com sucesso!");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 2000);

      // limpa o timer se o componente desmontar ou mensagem mudar antes
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <div className="flex flex-col gap-2">
      <div>
        {role === "USER" && (
          <button
            onClick={handlePromote}
            disabled={loading}
            className="ui-button ui-button--success-subtle"
          >
            {loading ? "Carregando..." : "Promover a Admin"}
          </button>
        )}

        {role === "ADMIN" && (
          <button
            onClick={handleDemote}
            disabled={loading}
            className="ui-button ui-button--warning-subtle"
          >
            {loading ? "Carregando..." : "Tornar Usuário Comum"}
          </button>
        )}
      </div>

      {/* Mensagem sempre abaixo */}
      <div className="min-h-[1.25rem]">
        {error && <p role="alert" className="text-[var(--color-error)]">{error}</p>}
        {success && <p role="status" className="text-[var(--color-success)]">{success}</p>}
      </div>
    </div>
  );
}
