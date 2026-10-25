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

  // Classes base idênticas ao ActionButton
  const buttonClasses = `flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-base font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-70`;

  return (
    <div className="flex flex-col gap-2">
      <div>
        {role === "USER" && (
          <button
            onClick={handlePromote}
            disabled={loading}
            className={`${buttonClasses} ${
              loading
                ? "cursor-not-allowed bg-[var(--color-gray-light)] text-[var(--text-secondary)]"
                : "bg-[var(--color-success-soft)] text-[var(--color-success)] hover:brightness-95"
            }`}
          >
            {loading ? "Carregando..." : "Promover a Admin"}
          </button>
        )}

        {role === "ADMIN" && (
          <button
            onClick={handleDemote}
            disabled={loading}
            className={`${buttonClasses} ${
              loading
                ? "cursor-not-allowed bg-[var(--color-gray-light)] text-[var(--text-secondary)]"
                : "bg-[var(--color-warning-soft)] text-[var(--color-warning)] hover:brightness-95"
            }`}
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
