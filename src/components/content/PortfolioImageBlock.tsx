"use client";

import Image from "next/image";
import { EditableText } from "@/components/dev/EditableText";
import type { EditableContentPath } from "@/components/dev/ContentDevContext";
import type { PortfolioImage } from "@/types";

interface PortfolioImageBlockProps {
  image: PortfolioImage;
  captionPath?: EditableContentPath;
  sizes: string;
}

export function PortfolioImageBlock({
  image,
  captionPath,
  sizes,
}: PortfolioImageBlockProps) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-black/8 bg-[rgba(249,245,239,0.86)] shadow-[0_14px_28px_rgba(0,0,0,0.08)]">
      <div className="relative aspect-[3/2]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          className="object-cover object-center"
        />
      </div>

      {image.caption ? (
        <figcaption className="border-t border-black/6 px-4 py-3 text-xs leading-6 text-stone-600">
          {captionPath ? (
            <EditableText
              as="span"
              path={captionPath}
              text={image.caption}
            />
          ) : (
            image.caption
          )}
        </figcaption>
      ) : null}
    </figure>
  );
}
