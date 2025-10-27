import Fastify from "fastify";
import cors from "@fastify/cors";
import routes from "./routes";
const app = Fastify({ logger: true });

const isVercel = !!process.env.VERCEL;
app.register(cors, {
  origin: [
    "https://dev-bills-front-end-wheat.vercel.app",
    "http://localhost:5173",
  ],
  methods: ["GET","POST","PUT","DELETE","PATCH","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: false,
});

const API_PREFIX = isVercel ? "/" : "/api";
app.register(routes, { prefix: API_PREFIX });

app.get("/health", async () => ({ status: "ok" }));
export default app;
