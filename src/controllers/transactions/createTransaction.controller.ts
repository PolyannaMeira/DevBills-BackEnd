import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma";
import type { CreateTransactionBody } from "../../schemas/transaction.schema";
/**
 * Controller to handle the creation of a new transaction.
 *
 * This function receives a Fastify request and reply, validates the request body
 * using the transaction schema, checks if the category exists and matches the type,
 * and then creates a new transaction in the database. Returns appropriate HTTP status codes
 * and error messages for invalid input or server errors.
 *
 * @param {FastifyRequest} request - The Fastify request object containing the transaction data.
 * @param {FastifyReply} reply - The Fastify reply object used to send the response.
 */
import { createTransactionSchema } from "../../schemas/transaction.schema";

const createTransaction = async (
  request: FastifyRequest<{ Body: CreateTransactionBody }>,
  reply: FastifyReply,
): Promise<void> => {
  
  const userId = request.userId;

  // Check if user is authenticated
  if (!userId) {
    reply.status(401).send({ error: "Unauthorized" });
    return;
  }

  // Validate request body using transaction schema
  const result = createTransactionSchema.safeParse(request.body);
  if (!result.success) {
    const errorMessage = result.error.errors[0].message || "Invalid request";
    reply.status(400).send({ error: errorMessage });
    return;
  }

  const transaction = result.data;

  try {
    // Check if the category exists and matches the transaction type
    const category = await prisma.category.findFirst({
      where: {
        id: transaction.categoryId,
        type: transaction.type,
      },
    });
    if (!category) {
      reply.status(400).send({ error: "Invalid category" });
      return;
    }

    // Parse the transaction date
    const parsedDate = new Date(transaction.date);

    // Create the new transaction in the database
    const newTransaction = await prisma.transaction.create({
      data: {
        ...transaction,
        userId: userId,
        date: parsedDate,
      },
      include: {
        category: true,
      },
    });
    // Send the created transaction as the response
    reply.status(201).send(newTransaction);
  } catch (error) {
    // Handle unexpected server errors
    reply.status(500).send({ error: "Internal Server Error" });
  }
};

export default createTransaction;
