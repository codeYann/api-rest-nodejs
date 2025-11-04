import { app } from "./app.js";
import { logger } from "./logger.js";
import { env } from "./env/index.js";

app
  .listen({ port: env.HTTP_PORT })
  .then(() => {
    logger.info(`Server is running on localhost:${env.HTTP_PORT}`);
  })
  .catch((err) => {
    logger.error(err);
    process.exit(1);
  });
