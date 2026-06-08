"use client";

import { useState, type FormEvent } from "react";

const MCPVIEWS_URL = "https://mcpviews.com";

interface ProjectBrowserAppProps {
  initialUrl?: string;
  title?: string;
}

const FRAME_BLOCKED_HOSTS = new Set(["decidrmcp.com", "ludflow.com"]);

function getUrlHost(value: string) {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function isFrameBlockedUrl(value: string) {
  return FRAME_BLOCKED_HOSTS.has(getUrlHost(value));
}

export function ProjectBrowserApp({
  initialUrl = MCPVIEWS_URL,
  title = "MCPViews",
}: ProjectBrowserAppProps) {
  const [frameKey, setFrameKey] = useState(0);
  const [addressValue, setAddressValue] = useState(initialUrl);
  const [currentUrl, setCurrentUrl] = useState(initialUrl);

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
        {isFrameBlockedUrl(currentUrl) ? (
          <div className="flex h-full items-center justify-center bg-[#f8f7f2] px-6 text-center">
            <div className="max-w-sm rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-normal text-stone-500">
                Embedded Preview Unavailable
              </p>
              <h2 className="mt-2 text-lg font-semibold text-stone-950">
                {title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                This site blocks iframe previews, so it needs to open in a browser tab.
              </p>
              <a
                href={currentUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-md border border-stone-300 bg-stone-900 px-3 py-2 text-[12px] font-semibold text-white transition hover:bg-stone-700"
              >
                Open Site
                <svg
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <path d="M7 17 17 7" />
                  <path d="M9 7h8v8" />
                </svg>
              </a>
            </div>
          </div>
        ) : (
          <iframe
            key={frameKey}
            title={title}
            src={currentUrl}
            className="h-full w-full border-0"
            referrerPolicy="no-referrer-when-downgrade"
            sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
          />
        )}
      </div>
    </div>
  );
}

export function McpViewsApp() {
  return <ProjectBrowserApp />;
}
