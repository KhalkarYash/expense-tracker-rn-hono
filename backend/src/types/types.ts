export interface Environment {
  Bindings: {
    DATABASE_URL: string;
    CLERK_KEY: string;
    UPSTASH_REDIS_REST_URL: string;
    UPSTASH_REDIS_REST_TOKEN: string;
  };
  Variables: {
    db: any;
  };
}

// Add this to ensure proper typing for the Context
declare module 'hono' {
  interface ContextVariableMap {
    db: any;
  }
}
