import { TransactionType } from "@prisma/client";
import { ObjectId } from "mongodb";
import { z } from "zod";

const isValidObjectId = (id: string): boolean => ObjectId.isValid(id);

//debug
const monthSchema = z.coerce.number().int().min(1).max(12);
const yearSchema  = z.coerce.number().int().min(1970).max(3000);

export const createTransactionSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.number().positive("Amount must be a positive number"),
  date: z.coerce.date({
    errorMap: () => ({ message: "Invalid date" }),
  }),
  categoryId: z.string().refine(isValidObjectId, {
    message: "Invalid ObjectId",
  }),
  type: z.enum([TransactionType.INCOME, TransactionType.EXPENSE], {
    errorMap: () => ({ message: "Type must be either 'INCOME' or 'EXPENSE'" }),
  }),
});

export const getTransactionsSchema = z.object({
  month: monthSchema.optional(),
 year: yearSchema.optional(),
  type: z
    .enum([TransactionType.INCOME, TransactionType.EXPENSE], {
      errorMap: () => ({ message: "Type must be either 'INCOME' or 'EXPENSE'" }),
    })
    .optional(),
  categoryId: z
    .string()
    .refine(isValidObjectId, {
      message: "Invalid ObjectId",
    })
    .optional(),
});

export const getTransactionsSummarySchema = z.object({
  month: z.string({ message: "Month is required" }),
  year: z.string({ message: "Year is required" }),
});

export const getHistoricalTransactionsSchema = z.object({
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2000).max(2100),
  months:z.coerce.number().min(1).max(12).optional(),

});

export const deleteTransactionSchema = z.object({
  id: z.string().refine(isValidObjectId, {
    message: "Invalid Id",
  }),
});

export type CreateTransactionBody = z.infer<typeof createTransactionSchema>;
export type GetTransactionsQuery = z.infer<typeof getTransactionsSchema>;
export type GetTransactionsSummaryQuery = z.infer<typeof getTransactionsSummarySchema>;
export type GetHistoricalTransactionsSchemaQuery = z.infer<typeof getHistoricalTransactionsSchema>;
export type DeleteTransactionParams = z.infer<typeof deleteTransactionSchema>;

