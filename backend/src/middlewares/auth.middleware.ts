import { Context, Next } from "hono";

export const authMiddleware = async (c: Context, next: Next) => {
    console.log("Auth middleware");
    await next();
}