"use client";

import type { KeyboardEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { encryptedProposal } from "./encryptedProposal";

type UnlockState = "idle" | "checking" | "ready" | "error" | "locked";
type PdfState = "idle" | "generating" | "error";

interface ProposalDocument {
  bodyHtml: string;
  styleText: string;
}

interface FontLinkConfig {
  id: string;
  rel: string;
  href: string;
  crossOrigin?: "" | "anonymous" | "use-credentials";
}

const pdfFileName = "make-wellness-data-engineering-proposal.pdf";

function base64ToBytes(value: string) {
  const binary = window.atob(value);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

async function decryptProposal(password: string) {
  const encodedPassword = new TextEncoder().encode(password);
  const salt = base64ToBytes(encryptedProposal.salt);
  const iv = base64ToBytes(encryptedProposal.iv);
  const ciphertext = base64ToBytes(encryptedProposal.ciphertext);
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    encodedPassword,
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  const key = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt,
      iterations: encryptedProposal.iterations,
    },
    keyMaterial,
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["decrypt"],
  );
  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    ciphertext,
  );

  return new TextDecoder().decode(decrypted);
}

function parseProposalHtml(html: string): ProposalDocument {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const printButton = doc.querySelector<HTMLButtonElement>(".nav-actions button");

  if (printButton) {
    printButton.removeAttribute("onclick");
    printButton.dataset.pdfDownload = "true";
    printButton.setAttribute("aria-label", "Download proposal as PDF");
    printButton.textContent = "Print";
  }

  return {
    bodyHtml: doc.body.innerHTML,
    styleText: Array.from(doc.querySelectorAll("style"))
      .map((style) => style.textContent ?? "")
      .join("\n"),
  };
}

function installFontLinks() {
  const links: FontLinkConfig[] = [
    {
      id: "make-font-preconnect-google",
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    },
    {
      id: "make-font-preconnect-gstatic",
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous",
    },
    {
      id: "make-font-styles",
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Lato:wght@400;700;900&family=Inter:wght@400;500;600;700;800&display=swap",
    },
  ];

  for (const linkConfig of links) {
    if (document.getElementById(linkConfig.id)) {
      continue;
    }

    const link = document.createElement("link");
    link.id = linkConfig.id;
    link.rel = linkConfig.rel;
    link.href = linkConfig.href;

    if (linkConfig.crossOrigin !== undefined) {
      link.crossOrigin = linkConfig.crossOrigin;
    }

    document.head.appendChild(link);
  }
}

export function MakeWellnessProposalClient() {
  const [proposal, setProposal] = useState<ProposalDocument | null>(null);
  const [unlockState, setUnlockState] = useState<UnlockState>("idle");
  const [pdfState, setPdfState] = useState<PdfState>("idle");
  const [attempts, setAttempts] = useState(0);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const botFieldRef = useRef<HTMLInputElement>(null);
  const proposalRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = useCallback(async () => {
    const proposalElement = proposalRef.current;

    if (!proposalElement || pdfState === "generating") {
      return;
    }

    setPdfState("generating");

    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      await document.fonts?.ready;

      const canvas = await html2canvas(proposalElement, {
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: false,
        scale: Math.min(window.devicePixelRatio || 1.25, 1.35),
        useCORS: true,
        windowHeight: proposalElement.scrollHeight,
        windowWidth: proposalElement.scrollWidth,
        onclone: (clonedDocument) => {
          clonedDocument.body.classList.add("proposal-exporting");
          clonedDocument
            .querySelectorAll("[data-pdf-download], .proposal-pdf-status")
            .forEach((node) => {
              if (node instanceof HTMLElement) {
                node.style.display = "none";
              }
            });
        },
      });
      const pdf = new jsPDF({
        compress: true,
        format: "a4",
        orientation: "portrait",
        unit: "pt",
      });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imageHeight = (canvas.height * pageWidth) / canvas.width;
      const imageData = canvas.toDataURL("image/jpeg", 0.86);
      let remainingHeight = imageHeight;
      let imageTop = 0;

      pdf.addImage(imageData, "JPEG", 0, imageTop, pageWidth, imageHeight, undefined, "FAST");
      remainingHeight -= pageHeight;

      while (remainingHeight > 0) {
        imageTop -= pageHeight;
        pdf.addPage();
        pdf.addImage(imageData, "JPEG", 0, imageTop, pageWidth, imageHeight, undefined, "FAST");
        remainingHeight -= pageHeight;
      }

      pdf.save(pdfFileName);
      setPdfState("idle");
    } catch (error) {
      console.error("PDF export failed", error);
      setPdfState("error");
    }
  }, [pdfState]);

  useEffect(() => {
    if (!proposal) {
      return undefined;
    }

    installFontLinks();

    const button = proposalRef.current?.querySelector<HTMLButtonElement>("[data-pdf-download]");

    if (!button) {
      return undefined;
    }

    button.addEventListener("click", handleDownloadPdf);

    return () => {
      button.removeEventListener("click", handleDownloadPdf);
    };
  }, [handleDownloadPdf, proposal]);

  useEffect(() => {
    const button = proposalRef.current?.querySelector<HTMLButtonElement>("[data-pdf-download]");

    if (!button) {
      return;
    }

    button.disabled = pdfState === "generating";
    button.textContent = pdfState === "generating" ? "Building PDF" : "Print";
  }, [pdfState, proposal]);

  async function handleUnlock() {
    if (unlockState === "checking" || unlockState === "locked") {
      return;
    }

    const password = passwordInputRef.current?.value ?? "";
    const botField = botFieldRef.current?.value ?? "";

    if (botField) {
      setUnlockState("locked");
      return;
    }

    setUnlockState("checking");

    try {
      const decryptedHtml = await decryptProposal(password);
      setProposal(parseProposalHtml(decryptedHtml));
      setUnlockState("ready");
      if (passwordInputRef.current) {
        passwordInputRef.current.value = "";
      }
      if (botFieldRef.current) {
        botFieldRef.current.value = "";
      }
    } catch {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      setUnlockState(nextAttempts >= 5 ? "locked" : "error");
    }
  }

  function handlePasswordKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    void handleUnlock();
  }

  if (proposal) {
    return (
      <>
        <style
          dangerouslySetInnerHTML={{
            __html: `${proposal.styleText}
              .proposal-exporting .top-banner,
              .proposal-exporting .nav-actions,
              .proposal-exporting .hero-actions,
              .proposal-exporting .cta,
              .proposal-exporting .proposal-pdf-status {
                display: none !important;
              }

              .proposal-pdf-status {
                background: #050505;
                border: 1px solid rgba(255, 255, 255, 0.2);
                bottom: 18px;
                color: #ffffff;
                font: 700 13px/1.4 Inter, Lato, Arial, sans-serif;
                left: 50%;
                letter-spacing: 0.08em;
                padding: 10px 14px;
                position: fixed;
                text-transform: uppercase;
                transform: translateX(-50%);
                z-index: 20;
              }

              [data-pdf-download]:disabled {
                opacity: 0.62;
              }
            `,
          }}
        />
        <div
          ref={proposalRef}
          data-proposal-root
          dangerouslySetInnerHTML={{ __html: proposal.bodyHtml }}
        />
        {pdfState !== "idle" ? (
          <div className="proposal-pdf-status" role="status" aria-live="polite">
            {pdfState === "generating" ? "Building PDF" : null}
            {pdfState === "error" ? "PDF export failed. Try again." : null}
          </div>
        ) : null}
      </>
    );
  }

  const isLocked = unlockState === "locked";
  const isChecking = unlockState === "checking";

  return (
    <main className="min-h-screen bg-[#f7f5f5] px-5 py-10 text-[#221e20]">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center">
        <section
          className="w-full border border-[rgba(50,46,41,0.16)] bg-white p-7 shadow-[0_26px_80px_rgba(0,0,0,0.12)]"
          aria-labelledby="proposal-access-title"
        >
          <span className="mb-3 block font-sans text-[11px] font-black uppercase tracking-[0.22em] text-[#7c736a]">
            Private proposal
          </span>
          <h1
            id="proposal-access-title"
            className="font-serif text-4xl font-semibold leading-tight text-[#050505]"
          >
            MAKE Wellness
          </h1>
          <div className="mt-8 grid gap-4">
            <div>
              <label
                className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-[#322e29]"
                htmlFor="proposal-password"
              >
                Password
              </label>
              <input
                autoComplete="off"
                className="h-12 w-full border border-[rgba(50,46,41,0.22)] bg-[#f8f6f1] px-3 text-base text-[#221e20] outline-none transition focus:border-[#050505]"
                disabled={isLocked}
                id="proposal-password"
                name="password"
                onKeyDown={handlePasswordKeyDown}
                ref={passwordInputRef}
                type="password"
              />
            </div>
            <input
              aria-hidden="true"
              autoComplete="off"
              className="pointer-events-none absolute left-[-100vw] h-0 w-0 opacity-0"
              name="website"
              ref={botFieldRef}
              tabIndex={-1}
              type="text"
            />
            <button
              className="min-h-11 border border-[#050505] bg-[#050505] px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-[#050505] focus:bg-white focus:text-[#050505] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isChecking || isLocked}
              onClick={() => void handleUnlock()}
              type="button"
            >
              {isChecking ? "Checking" : "Unlock"}
            </button>
            <p className="min-h-5 text-sm text-[#7c736a]" role="status" aria-live="polite">
              {unlockState === "error" ? "That password did not work." : null}
              {unlockState === "locked" ? "Access paused after too many attempts." : null}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
