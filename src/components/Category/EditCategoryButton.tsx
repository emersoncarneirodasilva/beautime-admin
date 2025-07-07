"use client";

import Link from "next/link";

type Props = {
  id: string;
};

export default function EditCategoryButton({ id }: Props) {
  return (
    <Link
      href={`/dashboard/categories/${id}/edit`}
      title="Editar categoria"
      className="text-blue-600 hover:text-blue-800 hover:cursor-pointer transition text-sm"
    >
      ✏️
    </Link>
  );
}
