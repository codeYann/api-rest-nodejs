import fastify from "fastify";
import cookie from "@fastify/cookie";
import { logger } from "./logger.js";

import { env } from "./env/index.js";
import { transactionRoutes } from "./routes/transactions.js";

const app = fastify();

app.register(cookie);
app.register(transactionRoutes, {
  prefix: "transactions",
});

app
  .listen({ port: env.HTTP_PORT })
  .then(() => {
    logger.info(`Server is running on localhost:${env.HTTP_PORT}`);
  })
  .catch((err) => {
    logger.error(err);
    process.exit(1);
  });
