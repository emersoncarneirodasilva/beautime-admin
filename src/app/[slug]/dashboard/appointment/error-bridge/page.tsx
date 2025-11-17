import { redirect } from "next/navigation";

export default function ErrorBridge({ searchParams }: { searchParams: any }) {
  const msg = searchParams.msg || searchParams.error || "Erro desconhecido";
  const t = Date.now();

  redirect(`../appointment?error=${encodeURIComponent(msg)}&ts=${t}`);
}
