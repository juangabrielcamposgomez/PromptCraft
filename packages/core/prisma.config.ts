import { defineConfig } from 'prisma/config'
import { PrismaPg } from '@prisma/adapter-pg'

const DATABASE_URL = process.env.DATABASE_URL?.startsWith("postgresql") 
  ? process.env.DATABASE_URL 
  : "postgresql://postgres:Salvador2024DB@promptcraft-db.cavgs6iey2uo.us-east-1.rds.amazonaws.com:5432/postgres";

export default defineConfig({
  earlyAccess: true,
  schema: './prisma/schema.prisma',
  datasource: {
    url: DATABASE_URL,
  },
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
  // @ts-ignore - Prisma 7 expects 'migrate' for driver adapters in CLI, but types might not be updated
  migrate: {
    adapter: () => {
      const { Pool } = require('pg')
      const pool = new Pool({
        connectionString: DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        }
      })
      return new PrismaPg(pool)
    },
  },
})
