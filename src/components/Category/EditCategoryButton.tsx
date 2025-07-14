"use client";

import Link from "next/link";

interface Props {
  slug: string;
  id: string;
}

export default function EditCategoryButton({ slug, id }: Props) {
  return (
    <Link
      href={`/${slug}/dashboard/categories/${id}/edit`}
      title="Editar categoria"
      className="text-blue-600 hover:text-blue-800 hover:cursor-pointer transition text-sm"
    >
      ✏️
    </Link>
  );
}
