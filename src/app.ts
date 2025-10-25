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

app.register(routes, { prefix: "/api" });

export default app;
