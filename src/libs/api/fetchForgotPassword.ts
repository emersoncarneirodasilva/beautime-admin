"use server";

export type ApiResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
};

export async function fetchForgotPassword(email: string): Promise<ApiResponse> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/password/forgot`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );

    if (!response.ok) {
      const raw = await response.json();

      const message = Array.isArray(raw)
        ? raw[0]?.message || "Erro de validação."
        : raw?.message || "Erro ao solicitar recuperação.";

      throw new Error(message);
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}
