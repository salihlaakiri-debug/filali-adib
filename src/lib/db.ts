import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | null | undefined;
};

function getDatabaseUrl(): string | null {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL;
  if (!url) return null;
  return url.replace(/channel_binding=require&?/, "").replace(/\?$/, "");
}

function createClient(): PrismaClient | null {
  try {
    const url = getDatabaseUrl();
    if (!url) {
      console.warn("No database URL found (DATABASE_URL / POSTGRES_URL). Database unavailable.");
      return null;
    }
    const { Pool } = require("pg");
    const { PrismaPg } = require("@prisma/adapter-pg");
    const pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  } catch (e) {
    console.warn("Database not available:", (e as Error).message);
    return null;
  }
}

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export function requireDb(): PrismaClient {
  if (!db) {
    throw new Error("DATABASE_URL not configured.");
  }
  return db;
}
