import knex, { type Knex } from "knex";
import { env } from "./env/index.js";

if (!env.DATABASE_URL) {
  throw new Error("DATABASE_URL ENV not found");
}

export const config: Knex.Config = {
  client: "sqlite",
  connection: {
    filename: env.DATABASE_URL,
  },
  migrations: {
    extension: "ts",
    directory: "./db/migrations",
  },
  useNullAsDefault: true,
};

export const db = knex(config);
