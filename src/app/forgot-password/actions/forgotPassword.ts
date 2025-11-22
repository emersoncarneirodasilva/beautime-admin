"use server";

import { redirect } from "next/navigation";
import { fetchForgotPassword } from "@/libs/api/fetchForgotPassword";

export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get("email")?.toString();

  if (!email) {
    redirect(
      `/forgot-password?error=${encodeURIComponent("E-mail inválido.")}`
    );
  }

  let result;
  try {
    result = await fetchForgotPassword(email);
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Não foi possível enviar o link de recuperação.";

    redirect(`/forgot-password?error=${encodeURIComponent(message)}`);
  }

  if (!result.success) {
    redirect(
      `/forgot-password?error=${encodeURIComponent(
        result.message || "Erro ao enviar e-mail."
      )}`
    );
  }

  redirect(
    `/login?success=${encodeURIComponent(
      "Se o e-mail existir, o link de recuperação foi enviado."
    )}`
  );
}
