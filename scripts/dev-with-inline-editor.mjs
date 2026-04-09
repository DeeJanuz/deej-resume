import { createServer } from "node:http";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const nextBin = require.resolve("next/dist/bin/next");
const editorPort = Number(process.env.RESUME_SITE_EDITOR_PORT ?? "4010");
const editorHost = "127.0.0.1";
const editorUrl = `http://${editorHost}:${editorPort}`;
const contentSourcePath = path.join(
  process.cwd(),
  "src/data/portfolio-content-source.ts",
);

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  response.end(JSON.stringify(payload));
}

const server = createServer(async (request, response) => {
  if (!request.url) {
    sendJson(response, 400, { ok: false, error: "Missing request URL." });
    return;
  }

  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    response.end();
    return;
  }

  if (request.method === "GET" && request.url === "/health") {
    sendJson(response, 200, {
      ok: true,
      mode: "local-inline-editor",
      contentSourcePath,
    });
    return;
  }

  if (request.method === "POST" && request.url === "/save") {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
    });

    request.on("end", async () => {
      try {
        const parsed = JSON.parse(body);
        if (typeof parsed.content !== "string") {
          sendJson(response, 400, {
            ok: false,
            error: "Expected string content.",
          });
          return;
        }

        await writeFile(contentSourcePath, parsed.content, "utf8");
        sendJson(response, 200, { ok: true });
      } catch (error) {
        sendJson(response, 500, {
          ok: false,
          error:
            error instanceof Error ? error.message : "Unknown save failure.",
        });
      }
    });

    return;
  }

  sendJson(response, 404, { ok: false, error: "Not found." });
});

await new Promise((resolve, reject) => {
  server.once("error", reject);
  server.listen(editorPort, editorHost, resolve);
});

const nextProcess = spawn(
  process.execPath,
  [nextBin, "dev", ...process.argv.slice(2)],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      NEXT_PUBLIC_RESUME_SITE_EDITOR_URL: editorUrl,
      NEXT_PUBLIC_RESUME_SITE_DEV_EDITING: "1",
    },
  },
);

function shutdown(signal) {
  server.close();
  if (!nextProcess.killed) {
    nextProcess.kill(signal);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

nextProcess.on("exit", (code, signal) => {
  server.close();

  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
