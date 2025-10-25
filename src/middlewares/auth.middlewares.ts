import type { FastifyReply, FastifyRequest } from "fastify";
import admin from "firebase-admin";

declare module "fastify" {
    interface FastifyRequest {
        userId?: string;
    }
}

export const authMiddleware = async(
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> => {
   const authHeader = request.headers.authorization;
    

   if (!authHeader || !authHeader.startsWith("Bearer ")) {
       reply.status(401).send({ message: "No token provided" });
       return;
   }
    const token = authHeader.replace("Bearer ", "")

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        console.log("Decoded Token:", decodedToken);
        request.userId = decodedToken.uid;
    } catch (error) {
        request.log.error({ error }, "Error verifying token");
        reply.status(401).send({ message: "Invalid token" });
    }
}