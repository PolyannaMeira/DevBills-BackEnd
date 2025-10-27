import app from "../src/app"; // seu app.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await app.ready();               // garante que plugins/rotas estão prontos
  // Delega a request ao servidor do Fastify
  app.server.emit("request", req, res);
}
