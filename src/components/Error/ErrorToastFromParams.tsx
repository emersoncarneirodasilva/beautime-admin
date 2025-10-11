"use client";

import { useSearchParams } from "next/navigation";
import ErrorToast from "./ErrorToast";

export default function ErrorToastFromParams() {
  const params = useSearchParams();
  const errorParam = params.get("error");

  if (!errorParam) return null;

  const decodedMessage = decodeURIComponent(errorParam);

  return <ErrorToast message={decodedMessage} />;
}
