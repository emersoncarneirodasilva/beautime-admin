"use server";

export type ApiResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
};

export async function fetchResetPassword(
  token: string,
  password: string
): Promise<ApiResponse> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/password/reset`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      }
    );

    if (!response.ok) {
      const error: ApiResponse = await response.json();
      throw new Error(error.message || "Erro ao redefinir senha.");
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}
