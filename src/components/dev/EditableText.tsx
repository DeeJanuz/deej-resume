"use client";

import { createElement } from "react";
import type { ClipboardEvent, FocusEvent, KeyboardEvent, MouseEvent } from "react";
import type { EditableContentPath } from "./ContentDevContext";
import { usePortfolioContent } from "./ContentDevContext";

type EditableTag =
  | "span"
  | "p"
  | "h1"
  | "h2"
  | "h3"
  | "li"
  | "div";

interface EditableTextProps {
  as?: EditableTag;
  path: EditableContentPath;
  text: string;
  className?: string;
  multiline?: boolean;
}

function normalizeText(value: string, multiline: boolean) {
  const cleaned = value.replace(/\u00a0/g, " ").replace(/\s+$/g, "");

  if (multiline) {
    return cleaned.trim();
  }

  return cleaned.replace(/\s+/g, " ").trim();
}

export function EditableText({
  as = "span",
  path,
  text,
  className,
  multiline = false,
}: EditableTextProps) {
  const { isEditMode, isLocal, updateText } = usePortfolioContent();
  const Tag = as;

  if (!isLocal || !isEditMode) {
    return createElement(Tag, { className }, text);
  }

  return createElement(
    Tag,
    {
      className: `${className ?? ""} rounded-md outline-none ring-1 ring-transparent transition hover:ring-[#2f6b73]/35 focus:bg-white/85 focus:ring-[#2f6b73]`,
      contentEditable: true,
      suppressContentEditableWarning: true,
      spellCheck: false,
      "data-edit-path": path.join("."),
      onClick: (event: MouseEvent<HTMLElement>) => {
        event.stopPropagation();
      },
      onBlur: (event: FocusEvent<HTMLElement>) => {
        const nextValue = normalizeText(
          event.currentTarget.innerText || event.currentTarget.textContent || "",
          multiline,
        );

        if (nextValue !== text) {
          updateText(path, nextValue);
        }
      },
      onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
        if (!multiline && event.key === "Enter") {
          event.preventDefault();
          event.currentTarget.blur();
        }
      },
      onPaste: (event: ClipboardEvent<HTMLElement>) => {
        event.preventDefault();
        const nextText = event.clipboardData.getData("text/plain");
        document.execCommand("insertText", false, nextText);
      },
    },
    text,
  );
}
