import Fastify from "fastify";
import cors from "@fastify/cors";
import routes from "./routes";

const app = Fastify({ logger: true });

// CORS ABERTO (teste)
app.register(cors, {
  origin: true, // reflete qualquer Origin
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false, // com Bearer, deixe false
});

// prefixo: na Vercel, use "/" (o /api externo já é dela)
const isVercel = !!process.env.VERCEL;
app.register(routes, { prefix: isVercel ? "/" : "/api" });

app.get("/health", async () => ({ status: "ok" }));

export default app;
