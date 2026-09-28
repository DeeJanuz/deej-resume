"use client";

import Markdown, {
  defaultUrlTransform,
  type Components,
  type UrlTransform,
} from "react-markdown";
import remarkGfm from "remark-gfm";
import { frametopReadme } from "@/data/frametop-readme";
import type { ProjectReadmeSnapshot } from "@/types";

interface ProjectReadmeAppProps {
  readme: ProjectReadmeSnapshot;
}

const ABSOLUTE_URL_PATTERN = /^([a-z][a-z\d+.-]*:|\/\/)/i;

const markdownComponents: Components = {
  a: ({ href, title, children }) => (
    <a href={href} title={title} target="_blank" rel="noreferrer">
      {children}
    </a>
  ),
};

// Resolve repo-relative README links and images against GitHub, the way
// github.com renders them, while keeping react-markdown's protocol filtering.
function createReadmeUrlTransform(readme: ProjectReadmeSnapshot): UrlTransform {
  return (url, key) => {
    const safeUrl = defaultUrlTransform(url);

    if (!safeUrl || ABSOLUTE_URL_PATTERN.test(safeUrl)) {
      return safeUrl;
    }

    if (safeUrl.startsWith("#")) {
      return `${readme.repoUrl}${safeUrl}`;
    }

    const repoPath = safeUrl.replace(/^\.?\//, "");
    const mode = key === "src" ? "raw" : "blob";

    return `${readme.repoUrl}/${mode}/${readme.branch}/${repoPath}`;
  };
}

export function ProjectReadmeApp({ readme }: ProjectReadmeAppProps) {
  const repoName = readme.repoUrl.replace(/^https:\/\/github\.com\//, "");

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#f5f4ef] text-stone-900">
      <div className="flex min-h-12 items-center gap-3 border-b border-stone-300/80 bg-[#ebe8df] px-3 py-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-semibold text-stone-700">
            {repoName}
            <span className="font-normal text-stone-500"> / README.md</span>
          </p>
          <p className="truncate text-[11px] text-stone-500">
            {`Saved copy from commit ${readme.commitSha.slice(0, 7)} (${readme.commitDate})`}
          </p>
        </div>
        <a
          href={readme.repoUrl}
          target="_blank"
          rel="noreferrer"
          className="flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-stone-300 bg-white/75 px-3 text-[12px] font-semibold text-stone-700 shadow-sm transition hover:bg-white"
        >
          View on GitHub
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
            <path d="M8 7h9v9" />
          </svg>
        </a>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto bg-white">
        <article className="project-readme mx-auto max-w-3xl px-6 py-7 sm:px-8">
          <Markdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
            urlTransform={createReadmeUrlTransform(readme)}
          >
            {readme.markdown}
          </Markdown>
        </article>
      </div>
    </div>
  );
}

export function FrametopReadmeApp() {
  return <ProjectReadmeApp readme={frametopReadme} />;
}
