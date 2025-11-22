"use server";

import { redirect } from "next/navigation";
import { fetchResetPassword } from "@/libs/api/fetchResetPassword";

export async function resetPasswordAction(formData: FormData) {
  const token = formData.get("token")?.toString();
  const newPassword = formData.get("new-password")?.toString();
  const confirmPassword = formData.get("confirm-password")?.toString();

  if (!token) {
    redirect(`/reset-password?error=${encodeURIComponent("Token inválido.")}`);
  }

  if (!newPassword || !confirmPassword) {
    redirect(
      `/reset-password/${token}?error=${encodeURIComponent(
        "Preencha todos os campos."
      )}`
    );
  }

  if (newPassword !== confirmPassword) {
    redirect(
      `/reset-password/${token}?error=${encodeURIComponent(
        "As senhas não coincidem."
      )}`
    );
  }

  let result;
  try {
    result = await fetchResetPassword(token, newPassword);
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Não foi possível redefinir sua senha.";

    redirect(`/reset-password/${token}?error=${encodeURIComponent(message)}`);
  }

  if (!result.success) {
    redirect(
      `/reset-password/${token}?error=${encodeURIComponent(
        result.message || "Erro ao redefinir senha."
      )}`
    );
  }

  redirect(
    `/login?success=${encodeURIComponent(
      "Senha redefinida com sucesso! Agora você pode fazer login."
    )}`
  );
}
