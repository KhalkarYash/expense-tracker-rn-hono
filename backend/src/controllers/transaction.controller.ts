import { Context } from "hono";
import { StatusCodes } from "../utils/statusCodes";

export const getTransaction = async (c: Context) => {
  try {
    const { userId } = c.req.param();
    if (!userId) {
      return c.json({ message: "Bad Request" }, StatusCodes.BAD_REQUEST);
    }
    const db = c.get("db");
    const transactions = await db`
      SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
      `;
    return c.json(
      {
        message: "Transactions fetched successfully",
        transactions,
      },
      StatusCodes.OK
    );
  } catch (error) {
    console.error(error);
    return c.json(
      { message: "Internal Server Error" },
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const addTransaction = async (c: Context) => {
  // title, amount, category, user_id
  try {
    const body = await c.req.json();
    const { title, amount, category, user_id } = body;
    if (!title || isNaN(amount) || !category || !user_id) {
      return c.json({ message: "Bad Request" }, StatusCodes.BAD_REQUEST);
    }
    const db = c.get("db");
    const transaction = await db`
      INSERT INTO transactions (title, amount, category, user_id) 
      VALUES (${title}, ${amount}, ${category}, ${user_id})
      RETURNING *
      `;
    return c.json(
      {
        message: "Transaction created successfully",
        transaction: transaction[0],
      },
      StatusCodes.CREATED
    );
  } catch (error) {
    console.error(error);
    return c.json(
      { message: "Internal Server Error" },
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const deleteTransaction = async (c: Context) => {
  try {
    const { id } = c.req.param();
    if (!id || isNaN(parseInt(id))) {
      return c.json({ message: "Bad Request" }, StatusCodes.BAD_REQUEST);
    }

    const db = c.get("db");
    const result = await db`
      DELETE FROM transactions WHERE id = ${id}
      RETURNING *
      `;
    if (result.length === 0) {
      return c.json(
        { message: "Transaction not found" },
        StatusCodes.NOT_FOUND
      );
    }

    return c.json(
      { message: "Transaction deleted successfully!" },
      StatusCodes.OK
    );
  } catch (error) {
    console.error(error);
    return c.json(
      { message: "Internal Server Error" },
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const getTransactionSummary = async (c: Context) => {
  try {
    const { userId } = c.req.param();

    const db = c.get("db");

    const balanceResult = await db`
        SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${userId}
      `;

    const incomeResult = await db`
      SELECT COALESCE(SUM(amount), 0) as income FROM transactions WHERE user_id = ${userId} AND amount > 0
    `;

    const expensesResult = await db`
    SELECT COALESCE(SUM(amount), 0) as expenses FROM transactions WHERE user_id = ${userId} AND amount < 0
    `;

    // income + therefore amount > 0, expense - therefore amount < 0

    return c.json(
      {
        message: "Returning user summary",
        balance: balanceResult[0].balance,
        income: incomeResult[0].income,
        expenses: expensesResult[0].expenses,
      },
      StatusCodes.OK
    );
  } catch (error) {
    console.error(error);
    return c.json(
      { message: "Internal Server Error" },
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
