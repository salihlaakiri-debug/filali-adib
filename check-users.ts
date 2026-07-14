import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

(async () => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true },
  });
  console.log("USERS:", JSON.stringify(users, null, 2));
  await prisma.$disconnect();
})();
