import { neon } from "@neondatabase/serverless";

export function connectDB (DATABASE_URL: string) : any {
    return neon(DATABASE_URL);
}