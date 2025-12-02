"use client";

import { useSearchParams } from "next/navigation";
import ErrorToast from "./ErrorToast";

export default function ErrorToastFromParams() {
  const params = useSearchParams();
  const errorParam = params.get("error");

  if (!errorParam) return null;

  let decodedMessage = decodeURIComponent(errorParam);

  try {
    const parsed = JSON.parse(decodedMessage);

    if (Array.isArray(parsed) && parsed[0]?.message) {
      let msg = parsed[0].message;

      // TRADUÇÃO LOCAL
      if (msg === "Invalid email") msg = "Credenciais inválidas.";

      decodedMessage = msg;
    }
  } catch {}

  return <ErrorToast message={decodedMessage} />;
}
