"use client";

import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { contentSource as initialContentSource } from "@/data/portfolio-content-source";
import type {
  PortfolioContentSource,
  PortfolioSection,
  PortfolioSectionId,
} from "@/types";

const CONTENT_SOURCE_FILE = "src/data/portfolio-content-source.ts";
const CONTENT_SOURCE_NAME = "portfolio-content-source.ts";
const DB_NAME = "resume-site-devtool";
const DB_VERSION = 1;
const STORE_NAME = "handles";
const HANDLE_KEY = "content-source";
const editorServiceUrl =
  process.env.NEXT_PUBLIC_RESUME_SITE_EDITOR_URL ?? "";

export type EditableContentPath = readonly (string | number)[];

type EditableFileHandle = FileSystemFileHandle & {
  queryPermission: (
    descriptor?: { mode?: "read" | "readwrite" },
  ) => Promise<PermissionState>;
  requestPermission: (
    descriptor?: { mode?: "read" | "readwrite" },
  ) => Promise<PermissionState>;
  createWritable: () => Promise<{
    write: (data: string) => Promise<void>;
    close: () => Promise<void>;
  }>;
};

type SupportedWindow = Window &
  typeof globalThis & {
    showOpenFilePicker?: (options?: {
      multiple?: boolean;
      excludeAcceptAllOption?: boolean;
      types?: Array<{
        description?: string;
        accept: Record<string, string[]>;
      }>;
    }) => Promise<EditableFileHandle[]>;
  };

interface ContentDevContextValue {
  content: PortfolioContentSource;
  portfolioSectionsById: Record<PortfolioSectionId, PortfolioSection>;
  sectionIndexById: Record<PortfolioSectionId, number>;
  isLocal: boolean;
  supportsFileEditing: boolean;
  hasSaveService: boolean;
  isEditMode: boolean;
  isDirty: boolean;
  hasConnectedFile: boolean;
  isBusy: boolean;
  status: string;
  lastSavedAt: string | null;
  connectFile: () => Promise<void>;
  disconnectFile: () => Promise<void>;
  saveChanges: () => Promise<void>;
  resetDraft: () => void;
  toggleEditMode: () => void;
  updateText: (path: EditableContentPath, value: string) => void;
}

const ContentDevContext = createContext<ContentDevContextValue | null>(null);

function isLocalHost(hostname: string) {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1"
  );
}

function cloneContent(source: PortfolioContentSource): PortfolioContentSource {
  return JSON.parse(JSON.stringify(source)) as PortfolioContentSource;
}

function setValueAtPath(
  source: PortfolioContentSource,
  path: EditableContentPath,
  value: string,
) {
  const root: Record<string, unknown> | unknown[] = Array.isArray(source)
    ? [...source]
    : { ...source };
  let cursor: Record<string, unknown> | unknown[] = root;

  for (let index = 0; index < path.length - 1; index += 1) {
    const key = path[index];
    const nextValue = (cursor as Record<string, unknown>)[key as string];
    const clonedNext = Array.isArray(nextValue)
      ? [...nextValue]
      : { ...(nextValue as Record<string, unknown>) };
    (cursor as Record<string, unknown>)[key as string] = clonedNext;
    cursor = clonedNext;
  }

  const lastKey = path[path.length - 1];
  (cursor as Record<string, unknown>)[lastKey as string] = value;

  return root as unknown as PortfolioContentSource;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function storeHandle(handle: EditableFileHandle) {
  const database = await openDatabase();

  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put(handle, HANDLE_KEY);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });

  database.close();
}

async function loadStoredHandle() {
  const database = await openDatabase();

  const handle = await new Promise<EditableFileHandle | null>(
    (resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readonly");
      const request = transaction.objectStore(STORE_NAME).get(HANDLE_KEY);
      request.onsuccess = () =>
        resolve((request.result as EditableFileHandle | undefined) ?? null);
      request.onerror = () => reject(request.error);
    },
  );

  database.close();
  return handle;
}

async function clearStoredHandle() {
  const database = await openDatabase();

  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).delete(HANDLE_KEY);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });

  database.close();
}

async function ensureReadWritePermission(handle: EditableFileHandle) {
  const descriptor = { mode: "readwrite" } as const;
  const current = await handle.queryPermission(descriptor);
  if (current === "granted") {
    return true;
  }

  const next = await handle.requestPermission(descriptor);
  return next === "granted";
}

async function hasReadWritePermission(handle: EditableFileHandle) {
  return (await handle.queryPermission({ mode: "readwrite" })) === "granted";
}

function toSourceFile(content: PortfolioContentSource) {
  return `import type { PortfolioContentSource } from "@/types";

export const contentSource = ${JSON.stringify(content, null, 2)} satisfies PortfolioContentSource;

export const siteProfile = contentSource.siteProfile;
export const portfolioSections = contentSource.portfolioSections;
`;
}

function formatTimestamp(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export function ContentDevProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [content, setContent] = useState<PortfolioContentSource>(() =>
    cloneContent(initialContentSource),
  );
  const [handle, setHandle] = useState<EditableFileHandle | null>(null);
  const [hasSaveService, setHasSaveService] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [status, setStatus] = useState(
    "Connect the content source file, enable edit mode, then click text on the page to edit it.",
  );
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLocal = useMemo(() => {
    if (!mounted) {
      return false;
    }

    return isLocalHost(window.location.hostname);
  }, [mounted]);

  const supportsFileEditing = useMemo(() => {
    if (!mounted) {
      return false;
    }

    return typeof (window as SupportedWindow).showOpenFilePicker === "function";
  }, [mounted]);

  useEffect(() => {
    if (!mounted || !isLocal || !editorServiceUrl) {
      return;
    }

    let cancelled = false;

    async function checkService() {
      try {
        const response = await fetch(`${editorServiceUrl}/health`);
        if (!response.ok || cancelled) {
          return;
        }

        setHasSaveService(true);
        setStatus(
          "Local save service is ready. Enable edit mode and click text on the page to change it.",
        );
      } catch {
        if (!cancelled) {
          setHasSaveService(false);
          setStatus(
            "Local save service is unavailable. Restart dev with npm run dev to enable inline save.",
          );
        }
      }
    }

    void checkService();

    return () => {
      cancelled = true;
    };
  }, [isLocal, mounted]);

  useEffect(() => {
    setContent(cloneContent(initialContentSource));
    setIsDirty(false);
  }, []);

  useEffect(() => {
    if (!mounted || !isLocal || !supportsFileEditing || hasSaveService) {
      return;
    }

    let cancelled = false;

    async function reconnectHandle() {
      try {
        const storedHandle = await loadStoredHandle();
        if (!storedHandle) {
          return;
        }

        const granted = await hasReadWritePermission(storedHandle);
        if (!granted) {
          await clearStoredHandle();
          if (!cancelled) {
            setStatus("Reconnect the content source file to save inline edits.");
          }
          return;
        }

        if (!cancelled) {
          setHandle(storedHandle);
          setStatus("Connected to local content source. Enable edit mode to click and edit text.");
        }
      } catch {
        if (!cancelled) {
          setStatus("Could not reconnect the stored file handle.");
        }
      }
    }

    void reconnectHandle();

    return () => {
      cancelled = true;
    };
  }, [hasSaveService, isLocal, mounted, supportsFileEditing]);

  const portfolioSectionsById = useMemo(
    () =>
      Object.fromEntries(
        content.portfolioSections.map((section) => [section.id, section]),
      ) as unknown as Record<PortfolioSectionId, PortfolioSection>,
    [content.portfolioSections],
  );

  const sectionIndexById = useMemo(
    () =>
      Object.fromEntries(
        content.portfolioSections.map((section, index) => [section.id, index]),
      ) as unknown as Record<PortfolioSectionId, number>,
    [content.portfolioSections],
  );

  const connectFile = useCallback(async () => {
    if (hasSaveService) {
      setStatus(
        "Local save service is already connected. Enable edit mode and start clicking text on the page.",
      );
      return;
    }

    const picker = (window as SupportedWindow).showOpenFilePicker;
    if (!picker) {
      setStatus("This browser does not support direct local file editing.");
      return;
    }

    setIsBusy(true);
    try {
      const [nextHandle] = await picker({
        multiple: false,
        excludeAcceptAllOption: false,
        types: [
          {
            description: "TypeScript source",
            accept: { "text/typescript": [".ts", ".tsx"] },
          },
        ],
      });

      if (!nextHandle) {
        return;
      }

      if (nextHandle.name !== CONTENT_SOURCE_NAME) {
        setStatus(`Pick ${CONTENT_SOURCE_FILE} so inline edits save to the right source file.`);
        return;
      }

      const granted = await ensureReadWritePermission(nextHandle);
      if (!granted) {
        setStatus("Read/write permission is required to save inline edits.");
        return;
      }

      await storeHandle(nextHandle);
      setHandle(nextHandle);
      setStatus("Connected. Enable edit mode and click text on the page to change it.");
    } catch (error) {
      if ((error as DOMException).name !== "AbortError") {
        setStatus("Could not connect the selected content source file.");
      }
    } finally {
      setIsBusy(false);
    }
  }, [hasSaveService]);

  const disconnectFile = useCallback(async () => {
    if (hasSaveService) {
      setStatus("The local save service stays available while npm run dev is running.");
      return;
    }

    await clearStoredHandle();
    setHandle(null);
    setIsEditMode(false);
    setStatus("Disconnected. Connect the content source file to save inline edits again.");
  }, [hasSaveService]);

  const saveChanges = useCallback(async () => {
    setIsBusy(true);
    try {
      if (hasSaveService) {
        const response = await fetch(`${editorServiceUrl}/save`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: toSourceFile(content),
          }),
        });

        if (!response.ok) {
          throw new Error("Save service returned a non-success response.");
        }
      } else {
        if (!handle) {
          setStatus("Connect the content source file before saving.");
          return;
        }

        const granted = await ensureReadWritePermission(handle);
        if (!granted) {
          setStatus("Read/write permission is required to save changes.");
          return;
        }

        const writable = await handle.createWritable();
        await writable.write(toSourceFile(content));
        await writable.close();
      }

      setIsDirty(false);
      setLastSavedAt(formatTimestamp(new Date()));
      setStatus("Saved inline edits to disk. Next dev should hot-reload the updated content.");
    } catch {
      setStatus("Could not save the content source file.");
    } finally {
      setIsBusy(false);
    }
  }, [content, handle, hasSaveService]);

  const resetDraft = useCallback(() => {
    setContent(cloneContent(initialContentSource));
    setIsDirty(false);
    setStatus("Reset the draft to the currently loaded content file.");
  }, []);

  const toggleEditMode = useCallback(() => {
    setIsEditMode((current) => {
      const next = !current;
      setStatus(
        next
          ? "Edit mode enabled. Click visible text on the page, change it, then click away."
          : "Edit mode disabled.",
      );
      return next;
    });
  }, []);

  const updateText = useCallback((path: EditableContentPath, value: string) => {
    setContent((current) => setValueAtPath(current, path, value));
    setIsDirty(true);
    setStatus("Draft updated. Save when you're ready.");
  }, []);

  const value = useMemo<ContentDevContextValue>(
    () => ({
      content,
      portfolioSectionsById,
      sectionIndexById,
      isLocal,
      supportsFileEditing,
      hasSaveService,
      isEditMode,
      isDirty,
      hasConnectedFile: hasSaveService || Boolean(handle),
      isBusy,
      status,
      lastSavedAt,
      connectFile,
      disconnectFile,
      saveChanges,
      resetDraft,
      toggleEditMode,
      updateText,
    }),
    [
      content,
      handle,
      isBusy,
      isDirty,
      isEditMode,
      isLocal,
      lastSavedAt,
      portfolioSectionsById,
      sectionIndexById,
      hasSaveService,
      connectFile,
      disconnectFile,
      saveChanges,
      resetDraft,
      status,
      supportsFileEditing,
      toggleEditMode,
      updateText,
    ],
  );

  return (
    <ContentDevContext.Provider value={value}>
      {children}
    </ContentDevContext.Provider>
  );
}

export function usePortfolioContent() {
  const context = useContext(ContentDevContext);

  if (!context) {
    throw new Error("usePortfolioContent must be used within ContentDevProvider.");
  }

  return context;
}
