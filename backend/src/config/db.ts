import { neon, NeonQueryFunction } from "@neondatabase/serverless";

export function connectDB(DATABASE_URL: string): NeonQueryFunction<false, false> {
    return neon(DATABASE_URL);
}

export async function initDB(sql: any) {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      user_id  VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      category VARCHAR(255) NOT NULL,
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
  } catch (error) {
    console.error(error);
  }
}