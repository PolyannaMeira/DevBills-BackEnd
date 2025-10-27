import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/app";

const isAllowedOrigin = (origin?: string) => {
  if (!origin) return true;
  if (origin === "https://dev-bills-front-end-wheat.vercel.app") return true;
  if (/^https:\/\/dev-bills-front-[a-z0-9-]+-polyannas-projects\.vercel\.app$/.test(origin)) return true;
  if (origin === "http://localhost:5173") return true;
  return false;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin as string | undefined;
  if (isAllowedOrigin(origin) && origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  await app.ready();
  app.server.emit("request", req, res);
}
