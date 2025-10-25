import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma";
import type { GetTransactionsQuery } from "../../schemas/transaction.schema";
import type { TransactionFilter } from "../../types/transaction.types";

dayjs.extend(utc);

export const getTransactions = async (
  request: FastifyRequest<{ Querystring: GetTransactionsQuery }>,
  reply: FastifyReply,
): Promise<void> => {
  const userId = request.userId;

  // Check if user is authenticated
  if (!userId) {
    reply.status(401).send({ error: "Unauthorized" });
    return;
  }

  const { month, year, type, categoryId } = request.query;

  const filters: TransactionFilter = { userId };

  if (month && year) {
    const startDate = dayjs.utc(`${year}-${month}-01`).startOf("month").toDate();
    const endDate = dayjs.utc(startDate).endOf("month").toDate();
    filters.date = {
      gte: startDate,
      lte: endDate,
    };
  }

  if (type) {
    filters.type = type;
  }
  if (categoryId) {
    filters.categoryId = categoryId;
  }

  try {
    const transactions = await prisma.transaction.findMany({
      where: filters,
      include: {
        category: {
          select: {
            type: true,
            name: true,
            color: true,
          },
        },
      },
    });
    reply.send(transactions);
  } catch (error) {
    request.log.error({ error }, "Error fetching transactions");
;
    reply.status(500).send({ error: "Internal Server Error" });
  }
};
