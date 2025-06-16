import { Context, Hono, Next } from "hono";

const app = new Hono();

app.use("*", async (c: Context, next: Next) => {
  c.text("Hi");
  await next();
});

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
