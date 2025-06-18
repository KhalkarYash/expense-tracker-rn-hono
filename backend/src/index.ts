import { Context, Hono, Next } from "hono";
import { connectDB, initDB } from "./config/db";
import { StatusCodes } from "./utils/statusCodes";
import transactionRouter from "./routes/transactions.route";
import rateLimiter from "./middlewares/rateLimiter";
import { Environment } from "./types/types";

const app = new Hono<Environment>();

app.use("*", async (c: Context<Environment>, next: Next) => {
  const db = connectDB(c.env.DATABASE_URL);
  try {
    c.set("db", db);
    await initDB(db);
  } catch (error) {
    console.error("Database connection error:", error);
    return c.json(
      { message: "Database connection failed" },
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
  await next();
});

app.use("*", rateLimiter);

// Mount the router
app.route("/", transactionRouter);

app.get("/", (c: Context<Environment>) => {
  return c.text("Hello Hono!");
});

app.get("/health", (c: Context<Environment>) => {
  return c.text("It is working", StatusCodes.OK);
});

export default app;
