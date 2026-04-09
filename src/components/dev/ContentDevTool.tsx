"use client";

import { useState } from "react";
import { usePortfolioContent } from "./ContentDevContext";

export function ContentDevTool() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    isLocal,
    supportsFileEditing,
    hasSaveService,
    isEditMode,
    isDirty,
    hasConnectedFile,
    isBusy,
    status,
    lastSavedAt,
    connectFile,
    disconnectFile,
    saveChanges,
    resetDraft,
    toggleEditMode,
  } = usePortfolioContent();

  if (!isLocal) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-[90] w-[min(520px,calc(100vw-2rem))]">
      <div className="pointer-events-auto overflow-hidden rounded-[24px] border border-black/10 bg-[rgba(255,255,255,0.94)] shadow-[0_24px_54px_rgba(0,0,0,0.18)] backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-black/8 px-4 py-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-500">
              Local Dev Tool
            </p>
            <p className="mt-1 text-sm font-medium text-stone-800">
              Click page text to edit it locally
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Localhost only
            </span>
            <button
              type="button"
              className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-stone-700 transition hover:bg-black/5"
              onClick={() => setIsOpen((value) => !value)}
            >
              {isOpen ? "Hide" : "Dev Mode"}
            </button>
          </div>
        </div>

        {isOpen ? (
          <div className="space-y-4 p-4">
            <div className="rounded-2xl border border-black/6 bg-[rgba(247,241,232,0.72)] p-4 text-sm leading-6 text-stone-700">
              <p>
                Connect
                {" "}
                <code>src/data/portfolio-content-source.ts</code>
                {" "}
                once, enable edit mode, then click any editable text on the page and type directly into it.
              </p>
              <p className="mt-2">
              Save writes the updated content back into the source file on disk. Cloudflare Pages will never see this toolbar because it only renders on localhost.
              </p>
            </div>

            {!hasSaveService && !supportsFileEditing ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                This browser does not support direct local file writes, and the localhost save service is not available. Restart the site with <code>npm run dev</code> to enable inline save in any browser, or use a Chromium-based browser as a fallback.
              </div>
            ) : null}

            <div className="flex flex-wrap items-center gap-2">
              {!hasSaveService ? (
                <button
                  type="button"
                  onClick={connectFile}
                  disabled={isBusy || !supportsFileEditing}
                  className="rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
                >
                  {hasConnectedFile ? "Reconnect File" : "Connect File"}
                </button>
              ) : (
                <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-800">
                  Local Save Ready
                </span>
              )}
              <button
                type="button"
                onClick={toggleEditMode}
                disabled={isBusy || (!hasSaveService && !supportsFileEditing)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isEditMode
                    ? "bg-[#2f6b73] text-white hover:bg-[#275b61]"
                    : "border border-black/10 text-stone-700 hover:bg-black/5"
                } disabled:cursor-not-allowed disabled:text-stone-400`}
              >
                {isEditMode ? "Disable Edit Mode" : "Enable Edit Mode"}
              </button>
              <button
                type="button"
                onClick={saveChanges}
                disabled={isBusy || !hasConnectedFile || !isDirty}
                className="rounded-full bg-[#2f6b73] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#275b61] disabled:cursor-not-allowed disabled:bg-[#8db5ba]"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={resetDraft}
                disabled={isBusy || !isDirty}
                className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-black/5 disabled:cursor-not-allowed disabled:text-stone-400"
              >
                Reset Draft
              </button>
              {!hasSaveService ? (
                <button
                  type="button"
                  onClick={disconnectFile}
                  disabled={isBusy || !hasConnectedFile}
                  className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-black/5 disabled:cursor-not-allowed disabled:text-stone-400"
                >
                  Disconnect
                </button>
              ) : null}
            </div>

            <div className="rounded-2xl border border-black/6 bg-white/80 px-4 py-3 text-sm text-stone-700">
              <p>{status}</p>
              <p className="mt-1 text-xs text-stone-500">
                {hasConnectedFile ? "File connected" : "No file connected"}
                {" • "}
                {isEditMode ? "edit mode on" : "edit mode off"}
                {" • "}
                {isDirty ? "unsaved changes" : "no unsaved changes"}
                {lastSavedAt ? ` • last saved ${lastSavedAt}` : ""}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
