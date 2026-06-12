import { defineConfig } from "prisma/config";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL!,
    adapter: () => new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  },
});

