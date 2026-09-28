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

function getImageAspectRatio(image: PortfolioImage, fallback = "3 / 2") {
  return image.width && image.height
    ? `${image.width} / ${image.height}`
    : fallback;
}

export function PortfolioImageBlock({
  image,
  captionPath,
  sizes,
}: PortfolioImageBlockProps) {
  return (
    <figure>
      <div
        className="relative overflow-hidden rounded-md bg-stone-100"
        style={{ aspectRatio: getImageAspectRatio(image) }}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          className="object-cover"
          style={{ objectPosition: image.objectPosition ?? "center" }}
        />
      </div>

      {image.caption ? (
        <figcaption className="mt-2 text-[12.5px] leading-5 text-stone-500">
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
