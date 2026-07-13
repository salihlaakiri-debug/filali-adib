import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | null | undefined;
};

function createClient(): PrismaClient | null {
  try {
    if (process.env.DATABASE_URL) {
      const { Pool } = require("pg");
      const { PrismaPg } = require("@prisma/adapter-pg");
      const pool = new Pool({ connectionString: process.env.DATABASE_URL });
      const adapter = new PrismaPg(pool);
      return new PrismaClient({ adapter });
    }
    console.warn("DATABASE_URL not set. Database unavailable.");
    return null;
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
