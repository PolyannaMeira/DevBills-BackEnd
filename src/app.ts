import Fastify from "fastify";
import fastifyCors from '@fastify/cors';

import routes from "./routes";

const app = Fastify({ logger: true });

//const allowedOrigin = 'https://dev-bills-front-8skduh2ay-polyannas-projects.vercel.app';

// CORS ABERTO (teste)
app.register(fastifyCors, { origin: true });

/*app.register(fastifyCors, {
  origin: (origin, cb) => {
    // Se origin for undefined (requests via curl/postman) permitir:
    if (!origin) return cb(null, true);
    // permitir apenas a origem do front ou use allowedOrigins.includes(origin)
    if (origin === allowedOrigin) return cb(null, true);
    // negar outras origens:
    cb(new Error('Not allowed'), false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  // preflight continuará sendo tratado automaticamente
});*/

// prefixo: na Vercel, use "/" (o /api externo já é dela)
const isVercel = !!process.env.VERCEL;
app.register(routes, { prefix: isVercel ? "/" : "/api" });

app.get("/health", async () => ({ status: "ok" }));

export default app;
