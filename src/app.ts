import Fastify from "fastify";
import cors from "@fastify/cors";
import routes from "./routes";
const app = Fastify({ logger: true });

const isAllowedOrigin = (origin?: string) => {
  if (!origin) return true; // curl/Postman
  const allowList = new Set([
    "https://dev-bills-front-end-wheat.vercel.app",
    "http://localhost:5173",
  ]);
  // libera previews: ex. https://dev-bills-front-XXXX-polyannas-projects.vercel.app
  const previewOk = /^https:\/\/dev-bills-front-[a-z0-9-]+-polyannas-projects\.vercel\.app$/.test(origin);
  return allowList.has(origin) || previewOk;
};

app.register(cors, {
  origin: (origin, cb) => cb(null, isAllowedOrigin(origin)),
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: false, // usa Bearer
});