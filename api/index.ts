import type { VercelRequest, VercelResponse } from "@vercel/node";
// Import robusto: pega default se existir, senão usa o próprio módulo
import * as appModule from "../src/app";
const app = (appModule as any).default ?? (appModule as any);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS aberto (teste)
  const origin = (req.headers.origin as string) || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  await app.ready();
  app.server.emit("request", req, res);
}
