import { Context, Next } from "hono";
import { StatusCodes } from "../utils/statusCodes";
import { getRateLimit } from "../config/upstash";
import { Environment } from "../types/types";

const rateLimiter = async (c: Context<Environment>, next: Next) => {
  try {
    const ratelimit = getRateLimit(c);
    const userIp = c.req.header("cf-connecting-ip");
    console.error("User IP:", userIp);
    const { success } = await ratelimit.limit(userIp || "default");

    if (!success) {
      return c.json(
        { message: "Too many requests. Please try again later." },
        StatusCodes.TOO_MANY_REQUESTS
      );
    }

    await next();
  } catch (error) {
    console.error("Rate limit ERROR:", error);
    return c.json(
      { message: "Rate limiting error" },
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export default rateLimiter;
