import { config } from "dotenv";
import { z } from "zod";
import { logger } from "../logger.js";

if (process.env.NODE_ENV === "test") {
  config({ path: ".env.test" });
} else {
  config();
}

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
  HTTP_PORT: z.number().default(3333),
  DATABASE_URL: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  logger.error({ issues: _env.error.issues }, "Invalid environment variables");
  throw new Error("Invalid environment variables");
}

export const env = _env.data;
