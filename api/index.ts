import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/app"; // seu app.ts

const ALLOWED_ORIGINS = new Set([
  "https://dev-bills-front-end-wheat.vercel.app",
  "http://localhost:5173",
]);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin || "";
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");

  // 1) Atenda o preflight aqui mesmo
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // 2) Delegue o restante pro Fastify
  await app.ready();
  app.server.emit("request", req, res);
}
