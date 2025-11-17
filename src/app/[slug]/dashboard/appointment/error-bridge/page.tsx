import { redirect } from "next/navigation";

export default async function ErrorBridge(props: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await props.params;

  const sp = (props.searchParams ? await props.searchParams : {}) ?? {};

  const msg = (sp.msg as string) ?? (sp.error as string) ?? "Erro desconhecido";

  redirect(
    `/${slug}/dashboard/appointment?error=${encodeURIComponent(
      msg
    )}&ts=${Date.now()}`
  );
}
