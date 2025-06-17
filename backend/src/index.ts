import { Context, Hono, Next } from "hono";
import { connectDB } from "./config/db";
import { StatusCodes } from "./utils/statusCodes";
import { authMiddleware } from "./middlewares/auth.middleware";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    CLERK_KEY: string;
  }
}>();

async function initDB(sql: any) {
  try {
    console.log("Initialising DB...")
    await sql`CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      user_id  VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      category VARCHAR(255) NOT NULL,
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`
    console.log("DB initialised successfully!")
  } catch (error) {
    console.error(error)
  }
}

app.use("/api/*", authMiddleware);

// Exclude specific routes (signin, signup) from authMiddleware
app.use("/api/signin", async (c, next) => {
  console.log("Authentication not required for this route");
  await next()

});  // No middleware for signin
app.use("/api/signup", async (c, next) => {
  console.log("Authentication not required for this route");
  await next()

});  // No middleware for signup

app.use("*", async (c: Context, next: Next) => {
  const db = connectDB(c.env.DATABASE_URL);
  try {
    c.set("db", db);
    await initDB(db);
    c.text("Hi");
  } catch (error) {
    console.error("Database connection error:", error);
    c.status(StatusCodes.INTERNAL_SERVER_ERROR)
    return c.json({ message: "Database connection failed" });
  }
  await next();
});

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/api/transactions/:userId", async (c: Context) => {
  try {
    const body = await c.req.json();
    const { userId } = body;
    if (!userId) {
      c.status(StatusCodes.BAD_REQUEST)
      return c.json({ message: "Bad Request" })
    }
    const db = c.get("db");
    const transactions = await db`
    SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
    `;
    c.status(StatusCodes.OK)
    return c.json({ message: "Transactions fetched successfully", transactions })
  } catch (error) {
    console.log(error)
    c.status(StatusCodes.INTERNAL_SERVER_ERROR)
    return c.json({ message: "Internal Server Error" })
  }
})

app.post("/api/transactions", async (c: Context) => {
  // title, amount, category, user_id
  try {
    const body = await c.req.json();
    const { title, amount, category, user_id } = body;
    if (!title || !amount === undefined || !category || !user_id) {
      c.status(StatusCodes.BAD_REQUEST)
      return c.json({ message: "Bad Request" })
    }
    const db = c.get("db");
    const transaction = await db`
    INSERT INTO transactions (title, amount, category, user_id) 
    VALUES (${title}, ${amount}, ${category}, ${user_id})
    RETURNING *
    `;
    console.log(transaction)
    c.status(201)
    return c.json({ message: "Transaction created successfully", transaction: transaction[0] })
  } catch (error) {
    console.log(error)
    c.status(StatusCodes.INTERNAL_SERVER_ERROR)
    return c.json({ message: "Internal Server Error" })
  }
})

app.delete("/api/transactions/:id", async (c: Context) => {
  try {
    const body = await c.req.json();
    const { id } = body;
    if (!id || isNaN(parseInt(id))) {
      c.status(StatusCodes.BAD_REQUEST)
      return c.json({ message: "Bad Request" })
    }

    const db = c.get("db");
    const result = await db`
    DELETE FROM transactions WHERE id = ${id}
    RETURNING *
    `;
    if (result.length === 0) {
      c.status(StatusCodes.NOT_FOUND)
      return c.json({ message: "Transaction not found" })
    }

    c.status(StatusCodes.OK);
    return c.json({ message: "Transaction deleted successfully!" })
  } catch (error) {
    console.log(error)
    c.status(StatusCodes.INTERNAL_SERVER_ERROR)
    return c.json({ message: "Internal Server Error" })
  }
})

app.get("/api/transactions/summary/:userId", async (c: Context) => {
  try {
    const body = await c.req.json();
    const { userId } = body;

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

  c.status(StatusCodes.OK);
  return c.json({ message: "Returning user summary", balance: balanceResult[0].balance, income: incomeResult[0].income, expenses: expensesResult[0].expenses })

  } catch (error) {
    console.log(error)
    c.status(StatusCodes.INTERNAL_SERVER_ERROR)
    return c.json({ message: "Internal Server Error" })
  }
})

export default app;
