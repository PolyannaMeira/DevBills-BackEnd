import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma";
import type { DeleteTransactionParams } from "../../schemas/transaction.schema";

export const deleteTransaction =  async (
    request: FastifyRequest<{ Params: DeleteTransactionParams }>,
    reply: FastifyReply,
): Promise<void> => {
    const userId = request.userId;

    // Check if user is authenticated
    if (!userId) {
        reply.status(401).send({ error: "Unauthorized" });
        return;
    }

    const { id } = request.params;

    if (!id) {
        reply.status(400).send({ error: "Transaction ID is required" });
        return;
    }

    try {
        const transaction = await prisma.transaction.findMany({
            where: {
                id,
                userId,
            },
        });

        if (!transaction) {
            reply.status(404).send({ error: "Transaction not found" });
            return;
        }

        await prisma.transaction.delete({
            where: { id },
        });

        reply.send({ message: "Transaction deleted successfully" });
    } catch (error) {
        request.log.error(`Error deleting transaction: ${error}`);
        reply.status(500).send({ error: "Internal Server Error" });
    }
}
