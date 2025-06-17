import { Hono } from "hono";
import * as transactionController from "../controllers/transaction.controller";
import { Environment } from "../types/types";

// Create router with proper typing for the base path
const router = new Hono<Environment>().basePath('/api');

// Define routes without the /api prefix since it's handled by basePath
router.get("/transactions/:userId", transactionController.getTransaction);
router.post("/transactions", transactionController.addTransaction);
router.delete("/transactions/:id", transactionController.deleteTransaction);
router.get(
  "/transactions/summary/:userId",
  transactionController.getTransactionSummary
);

export default router;
