"use client";

import Link from "next/link";

interface EditButtonProps {
  href: string;
  text?: string | React.ReactNode;
  className?: string;
}

export default function EditButton({
  href,
  text = "Editar",
  className = "",
}: EditButtonProps) {
  return (
    <Link href={href} className={className}>
      {text}
    </Link>
  );
}
