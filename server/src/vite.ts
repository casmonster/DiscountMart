// server/src/vite.ts
import { type Application } from "express";
import { type Server } from "http";

/**
 * Simple logger
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
 * Dummy Vite setup to avoid crashes in production
 */
export async function setupVite(app: Application, server: Server): Promise<void> {
  log("Vite middleware is disabled in this environment.", "vite");
}
