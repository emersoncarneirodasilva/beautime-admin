"use client";

import { useState, useMemo } from "react";
import Image from "next/image";

interface ProfessionalAvatarProps {
  src?: string | null;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

// Domínios permitidos para imagens externas
const allowedDomains = [
  "images.pexels.com",
  "images.unsplash.com",
  "via.placeholder.com",
];

export default function ProfessionalAvatar({
  src,
  alt,
  width,
  height,
  className,
}: ProfessionalAvatarProps) {
  const validImageUrl = useMemo(() => {
    if (!src) return null;

    // Permite URLs relativas
    if (src.startsWith("/")) return src;

    try {
      const url = new URL(src);

      // Permite subdomínios dos domínios autorizados
      const isAllowed = allowedDomains.some(
        (domain) =>
          url.hostname === domain || url.hostname.endsWith(`.${domain}`)
      );

      return isAllowed ? src : null;
    } catch {
      // URL inválida cai no fallback
      return null;
    }
  }, [src]);

  const [imgSrc, setImgSrc] = useState(
    validImageUrl ?? "/images/default-avatar.png"
  );

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      placeholder="blur"
      blurDataURL="/images/default-avatar.png"
      onError={() => setImgSrc("/images/default-avatar.png")}
    />
  );
}
