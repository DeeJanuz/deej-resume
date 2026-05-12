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
    <figure className="overflow-hidden rounded-lg border border-stone-200 bg-white">
      <div className="relative aspect-[3/2]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          loading="eager"
          sizes={sizes}
          className="object-cover object-center"
        />
      </div>

      {image.caption ? (
        <figcaption className="border-t border-stone-200 px-4 py-3 text-xs leading-6 text-stone-600">
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
