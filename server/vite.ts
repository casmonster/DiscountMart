import * as express from "express";
import { type Application } from "express";
import fs from "fs";
import path from "path";
import { type Server } from "http";

/**
 * Log messages with timestamp and source label
 */
export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

/**
 * Dummy setupVite function (no-op since Vite dev middleware is not used)
 */
export async function setupVite(app: Application, server: Server): Promise<void> {
  log("Vite middleware is disabled in this environment.", "vite");
}

/**
 * Serve built static files from /client/dist (or wherever your frontend build output lives)
 */
export function serveStatic(app: Application): void {
  const distPath = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../client/dist");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}. Make sure to build the client first.`
    );
  }

  app.use(express.static(distPath));

  // For all other routes, serve index.html (SPA fallback)
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
