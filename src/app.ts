import Fastify from "fastify";
import { env } from "./config/env";
import routes from "./routes/index";
import cors from "@fastify/cors";

const app = Fastify({
  logger: {
    level: env.NODE_ENV === "dev" ? "info" : "error",
  },
});

app.register(cors,{
   origin: [
    "https://dev-bills-front-end-wheat.vercel.app",
    "http://localhost:5173", 
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
});

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const API_PREFIX = (env as any).API_PREFIX ?? "/"; // deixe "/" na Vercel; pode usar "/api" local se quiser
app.register(routes, { prefix: API_PREFIX });

app.get("/health", async () => ({ status: "ok" }));

export default app;
