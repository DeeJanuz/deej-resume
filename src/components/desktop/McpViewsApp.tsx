"use client";

import { useState, type FormEvent } from "react";

const MCPVIEWS_URL = "https://mcpviews.com";

export function McpViewsApp() {
  const [frameKey, setFrameKey] = useState(0);
  const [addressValue, setAddressValue] = useState(MCPVIEWS_URL);
  const [currentUrl, setCurrentUrl] = useState(MCPVIEWS_URL);

  function normalizeUrl(value: string) {
    const trimmed = value.trim();

    if (!trimmed) {
      return currentUrl;
    }

    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }

    return `https://${trimmed}`;
  }

  function reloadPage() {
    setFrameKey((key) => key + 1);
  }

  function handleNavigate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextUrl = normalizeUrl(addressValue);
    setAddressValue(nextUrl);
    setCurrentUrl(nextUrl);
    setFrameKey((key) => key + 1);
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#f5f4ef] text-stone-900">
      <form
        className="flex min-h-12 items-center gap-2 border-b border-stone-300/80 bg-[#ebe8df] px-3"
        onSubmit={handleNavigate}
      >
        <span className="hidden text-[12px] font-semibold text-stone-600 sm:block">
          Browser
        </span>
        <button
          type="button"
          aria-label="Reload page"
          title="Reload"
          onClick={reloadPage}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-stone-300 bg-white/75 text-sm font-semibold text-stone-700 shadow-sm transition hover:bg-white"
        >
          <svg
            aria-hidden="true"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          >
            <path d="M21 12a9 9 0 1 1-2.64-6.36" />
            <path d="M21 3v6h-6" />
          </svg>
        </button>
        <label className="sr-only" htmlFor="browser-address">
          Browser address
        </label>
        <input
          id="browser-address"
          value={addressValue}
          onChange={(event) => setAddressValue(event.target.value)}
          className="min-w-0 flex-1 rounded-md border border-stone-300 bg-white px-3 py-1.5 text-[12px] text-stone-700 shadow-inner outline-none transition focus:border-stone-500"
          inputMode="url"
          spellCheck={false}
        />
        <button
          type="submit"
          className="flex h-8 items-center rounded-md border border-stone-300 bg-white/75 px-3 text-[12px] font-semibold text-stone-700 shadow-sm transition hover:bg-white"
        >
          Go
        </button>
      </form>

      <div className="relative min-h-0 flex-1 bg-white">
        <iframe
          key={frameKey}
          title="MCPViews"
          src={currentUrl}
          className="h-full w-full border-0"
          referrerPolicy="no-referrer-when-downgrade"
          sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        />
      </div>
    </div>
  );
}
