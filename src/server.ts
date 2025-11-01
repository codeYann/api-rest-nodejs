import fastify from "fastify";
import { env } from "./env/index.js";
import { logger } from "./logger.js";

const app = fastify();

app.get("/", (req, res) => {
  res.send("Hello World");
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
