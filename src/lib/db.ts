import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient() {
  if (process.env.DATABASE_URL?.startsWith("postgres")) {
    const { Pool } = require("pg");
    const { PrismaPg } = require("@prisma/adapter-pg");
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  }

  const path = require("node:path");
  const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
  const dbPath = path.resolve(process.cwd(), "prisma", "dev.db");
  const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
