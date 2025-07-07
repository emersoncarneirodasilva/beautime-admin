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

    try {
      const url = new URL(src);
      return allowedDomains.includes(url.hostname) ? src : null;
    } catch {
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
      onError={() => setImgSrc("/images/default-avatar.png")}
    />
  );
}
