import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { db } from "../database.js";
import crypto, { randomUUID } from "node:crypto";
import { logger } from "../logger.js";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists.js";

export async function transactionRoutes(app: FastifyInstance) {
  app.get("/", { preHandler: [checkSessionIdExists] }, async (request) => {
    const { sessionId } = request.cookies;

    const transactions = await db("transactions")
      .where("session_id", sessionId)
      .select("*");

    logger.info(
      `Fetched ${transactions.length} transaction${transactions.length === 1 ? "" : "s"} from database`,
    );
    return { transactions };
  });

  app.get("/:id", { preHandler: [checkSessionIdExists] }, async (request) => {
    const getTransactionParamsSchema = z.object({
      id: z.uuid(),
    });

    const { id } = getTransactionParamsSchema.parse(request.params);

    const { sessionId } = request.cookies;

    const transaction = await db("transaction")
      .where({ id, session_id: sessionId })
      .first();
    return { transaction };
  });

  app.get(
    "/summary",
    { preHandler: [checkSessionIdExists] },
    async (request) => {
      const { sessionId } = request.cookies;

      const summary = await db("transactions")
        .where("session_id", sessionId)
        .sum("amount", { as: "amount" })
        .first();
      return { summary };
    },
  );

  app.post("/", async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"]),
    });

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    );

    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();
      const SEVEN_DAYS_MAX_AGE = 60 * 60 * 24 * 7;

      reply.cookie("sessionId", sessionId, {
        path: "/",
        maxAge: SEVEN_DAYS_MAX_AGE,
      });
    }

    await db("transactions").insert({
      id: crypto.randomUUID(),
      title,
      amount: type === "credit" ? amount : amount * -1,
      session_id: sessionId,
    });

    logger.info(
      `Transaction created successfully: title="${title}", amount=${amount}, type="${type}"`,
    );

    return reply.status(201).send();
  });
}
