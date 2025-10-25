
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma";
import type { GetTransactionsSummaryQuery } from "../../schemas/transaction.schema";
import type { CategorySummary } from "../../types/category.types";
import type { TransactionSummary } from "../../types/transaction.types";

dayjs.extend(utc);

// (Opcional) enum em runtime para evitar typos:
const TRANSACTION_TYPE = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
} as const;
type TransactionType = typeof TRANSACTION_TYPE[keyof typeof TRANSACTION_TYPE];


export const getTransactionsSummary = async (
  request: FastifyRequest<{ Querystring: GetTransactionsSummaryQuery }>,
  reply: FastifyReply,
): Promise<void> => {
  const userId = request.userId;

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
      if (transaction.type === TRANSACTION_TYPE.EXPENSE) { // <-- comparação em runtime
        const key = transaction.categoryId ?? "uncategorized";

        const existing =
          groupedExpenses.get(key) ??
          {
            categoryId: transaction.categoryId ?? "uncategorized",
            categoryName: transaction.category?.name ?? "Sem categoria",
            categoryColor: transaction.category?.color ?? "#9CA3AF",
            amount: 0,
            percentage: 0,
          };

        existing.amount += transaction.amount;
        groupedExpenses.set(key, existing);

        totalExpenses += transaction.amount;
      } else {
        totalIncomes += transaction.amount;
      }
    }

    const summary: TransactionSummary = {
      totalExpenses,
      totalIncome: totalIncomes,
      balance: Number((totalIncomes - totalExpenses).toFixed(2)),
      expenseByCategory: Array.from(groupedExpenses.values())
        .map((entry) => ({
          ...entry,
          percentage:
            totalExpenses > 0
              ? Number(((entry.amount / totalExpenses) * 100).toFixed(2))
              : 0,
        }))
        .sort((a, b) => b.amount - a.amount),
    };

    reply.send(summary);
  } catch (error) {
    request.log.error(`Error fetching transactions: ${String(error)}`);
    reply.status(500).send({ error: "Internal Server Error" });
  }
};
