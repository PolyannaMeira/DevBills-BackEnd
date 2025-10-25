
import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../../src/app"; 

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Garante que o Fastify e as rotas estão prontos
  await app.ready();

  // Encaminha a requisição da Vercel para o servidor HTTP interno do Fastify
  app.server.emit("request", req, res);
}
