import type { FastifyReply, FastifyRequest } from "fastify";
import type { GetHistoricalTransactionsSchemaQuery } from "../../schemas/transaction.schema";
import dayjs from "dayjs";
import "dayjs/locale/pt-BR";
import utc from "dayjs/plugin/utc";
import prisma from "../../config/prisma";
import type { Prisma } from "@prisma/client";

dayjs.locale("pt-BR");
dayjs.extend(utc);

/**
 * Retrieves a user's historical transactions (income and expenses)
 * over a specified number of months, grouped by month.
 *
 * Steps:
 * 1. Verify user authentication
 * 2. Get query params (month, year, and number of months)
 * 3. Define the date range to fetch transactions
 * 4. Fetch transactions from the database using Prisma
 * 5. Group transactions by month and calculate income/expense totals
 * 6. Return a summary of monthly data
 */

type Tx = Prisma.TransactionGetPayload<{
  select: { amount: true; type: true; date: true }
}>;

export const getHistoricalTransactions = async (
  request: FastifyRequest<{ Querystring: GetHistoricalTransactionsSchemaQuery }>,
  reply: FastifyReply
): Promise<void> => {
  const userId = request.userId;

  // Check if the user is authenticated
  if (!userId) {
    reply.status(401).send({ error: "User not authenticated" });
    return;
  }

  // Extract query parameters (month, year, and months count)
  const { month, year, months = 6 } = request.query;

  // Define the base month and calculate the full date range
  const baseDate = new Date(year, month - 1, 1);

  const startDate = dayjs.utc(baseDate).subtract(months, "month").startOf("month").toDate();
  const endDate = dayjs.utc(baseDate).endOf("month").toDate();

  try {
    // Fetch transactions within the given date range
    const transactions: Tx[] =await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        amount: true,
        type: true,
        date: true,
      },
    });

    // Create an array of month objects with initial zero values
    const monthlyData = Array.from({ length: months }, (_, i) => {
      const date = dayjs.utc(baseDate).subtract(months - 1 - i, "month");
      return {
        name: date.format("MMM/YYYY"),
        income: 0,
        expenses: 0,
      };
    });

    // Group transactions by month and sum income and expense values
    // biome-ignore lint/complexity/noForEach: <explanation>
       transactions.forEach((transaction: Tx) => {
  const monthKey = dayjs.utc(transaction.date).format("MMM/YYYY");
  const monthData = monthlyData.find((m) => m.name === monthKey);

  if (monthData) {
    if (transaction.type === "INCOME") {
      monthData.income += transaction.amount;
    } else {
      monthData.expenses += transaction.amount;
    }
  }
});

    // Send the summarized historical data as response
    reply.send({ history: monthlyData });
  } catch (err) {
    // Handle unexpected errors
    reply.status(500).send({ error: "Failed to fetch transaction history" });
  }
};
