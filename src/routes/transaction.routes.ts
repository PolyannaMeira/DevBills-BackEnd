import type { FastifyInstance } from "fastify";
import { zodToJsonSchema } from "zod-to-json-schema";
import createTransaction from "../controllers/transactions/createTransaction.controller";
import { getTransactionsSummary } from "../controllers/transactions/getTransactionSummary.controller";
import { getTransactions } from "../controllers/transactions/getTransactions.controller";
import {getHistoricalTransactions} from "../controllers/transactions/getHistoricalTransactions.controller"
import {deleteTransaction} from "../controllers/transactions/deleteTransaction.controller";
import { getTransactionsSummarySchema } from "../schemas/transaction.schema";
import { getTransactionsSchema } from "../schemas/transaction.schema";
import {getHistoricalTransactionsSchema} from "../schemas/transaction.schema"
import { createTransactionSchema } from "../schemas/transaction.schema";
import { deleteTransactionSchema } from "../schemas/transaction.schema";
import { authMiddleware } from "../middlewares/auth.middlewares";

const transactionRoutes = async (fastify: FastifyInstance) => {

fastify.addHook("preHandler", authMiddleware); 

  //create
  fastify.route({
    url: "/",
    method: "POST",
    schema: {
      body: zodToJsonSchema(createTransactionSchema),
    },
    handler: createTransaction,
  });

  //chearche avec filters
  fastify.route({
    url: "/",
    method: "GET",
    schema: {
      querystring: zodToJsonSchema(getTransactionsSchema),
    },
    handler: getTransactions,
  });

  //Searche Summary
  fastify.route({
    url: "/summary",
    method: "GET",
    schema: {
      querystring: zodToJsonSchema(getTransactionsSummarySchema),
    },
    handler: getTransactionsSummary,
  });

  //Historico de transações
  fastify.route({
    url: "/historical",
    method: "GET",
    schema: {
      querystring: zodToJsonSchema(getHistoricalTransactionsSchema),
    },
    handler: getHistoricalTransactions,
  });


//Delete Transaction
fastify.route({
    url: "/:id",
    method: "DELETE",
    schema: {
      params: zodToJsonSchema(deleteTransactionSchema),
    },
    handler: deleteTransaction,
  });
};

export default transactionRoutes;
