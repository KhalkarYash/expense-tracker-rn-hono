import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis/cloudflare";
import { Context } from "hono";
import { Environment } from "../types/types";

export const getRateLimit = (c: Context<Environment>) => {
  const redisUrl = c.env.UPSTASH_REDIS_REST_URL;
  const redisToken = c.env.UPSTASH_REDIS_REST_TOKEN;

  const redis = new Redis({
    url: redisUrl,
    token: redisToken,
  });

  const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(100, "60 s"),
  });
  return ratelimit;
};
