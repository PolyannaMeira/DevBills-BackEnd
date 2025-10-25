import { TransactionType } from "@prisma/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma";
import type { GetTransactionsSummaryQuery } from "../../schemas/transaction.schema";
import type { CategorySummary } from "../../types/category.types";
import type { TransactionSummary } from "../../types/transaction.types";

dayjs.extend(utc);

export const getTransactionsSummary = async (
  request: FastifyRequest<{ Querystring: GetTransactionsSummaryQuery }>,
  reply: FastifyReply,
): Promise<void> => {
  const userId = request.userId;

  // Check if user is authenticated
  if (!userId) {
    reply.status(401).send({ error: "Unauthorized" });
    return;
  }

  const { month, year } = request.query;

  if (!month || !year) {
    reply.status(400).send({ error: "Month and Year are required" });
    return;
  }

  const startDate = dayjs.utc(`${year}-${month}-01`).startOf("month").toDate();
  const endDate = dayjs.utc(startDate).endOf("month").toDate();

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: true,
      },
    });

    let totalExpenses = 0;
    let totalIncomes = 0;
    const groupedExpenses = new Map<string, CategorySummary>();

    for (const transaction of transactions) {
      if (transaction.type === TransactionType.EXPENSE) {
        
        const existing = groupedExpenses.get(transaction.categoryId) ?? { //?? - if it is false
          categoryId: transaction.categoryId,
          categoryName: transaction.category.name,
          categoryColor: transaction.category.color,
          amount: 0,
          percentage: 0,
        };

        existing.amount += transaction.amount;
        groupedExpenses.set(transaction.categoryId, existing);

        totalExpenses += transaction.amount;
      } else {
        totalIncomes += transaction.amount;
      }
    }

    const summary: TransactionSummary = {
      totalExpenses,
      totalIncome: totalIncomes,
      balance: Number((totalIncomes - totalExpenses).toFixed(2)),
      expenseByCategory: Array.from(groupedExpenses.values()).map((entry) => ({
        ...entry,
        percentage: Number.parseFloat(((entry.amount / totalExpenses) * 100).toFixed(2)),
      })).sort((a, b) => b.amount - a.amount),
    };

    console.log({ groupedExpenses, totalExpenses, totalIncomes });
    reply.send(summary);
  } catch (error) {
    request.log.error(`Error fetching transactions: ${error}`);
    reply.status(500).send({ error: "Internal Server Error" });
  }
};
