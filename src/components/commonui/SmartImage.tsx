"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";

interface SmartImageProps extends Omit<ImageProps, "onError"> {
  fallback?: string;
}

export const SmartImage = ({
  src,
  fallback = "/placeholder-image.svg",
  alt,
  ...props
}: SmartImageProps) => {
  const [hasError, setHasError] = useState(false);

  const imageSrc = hasError || !src ? fallback : src;

  const [prevSrc, setPrevSrc] = useState(src);

  if (src !== prevSrc) {
    setHasError(false);
    setPrevSrc(src);
  }

  return (
    <Image
      {...props}
      key={typeof src === "string" ? src : undefined}
      src={imageSrc}
      alt={alt || "product image"}
      onError={() => {
        setHasError(true);
      }}
      unoptimized={true}
    />
  );
};
